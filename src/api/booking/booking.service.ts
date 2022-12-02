import { MESSAGES } from "@/constants";
import {ENVIROMENT } from '@/config';
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import { bookingRepository } from "@/repositories/booking.repository";
import { brandRepository } from "@/repositories/brand.repository";
import { userRepository } from "@/repositories/user.repository";
import { locationRepository } from "@/repositories/location.repository";
import { larkOpenAPIService } from "@/service/lark.service";
import "moment-timezone";
import moment from 'moment';
import {
  ReScheduleBookingPayloadRequest,
  ScheduleTime,
  BookingPayloadRequest,
  SlotTime,
  Timezones,
  TimeZoneText,
} from "./booking.type";
import {CreateEventResponse} from '@/types/lark.type';
import {mappingSlotAvailable} from './booking.mapping';
import { brandService } from "../brand/brand.service";
import { BookingAttributes } from "@/model/booking.model";
import { mailService } from "@/service/mail.service";

export default class BookingService {

  public async availableSchedule(date: string) {
    const numberOfWeek = moment(date).isoWeekday();
    if (numberOfWeek == 6 || numberOfWeek == 7) {
      return errorMessageResponse(MESSAGES.BOOKING.SCHEDULE_NOT_AVAILABLE);
    }
    // start -> 08:00:00 AM
    const unixStartTime = moment(`${date} 08:00:00+08:00`).format("X");
    // end -> 06:00:00 PM
    const unixEndTime = moment(`${date} 18:00:00+08:00`).format("X");

    /// get events from Lark API
    const response = await larkOpenAPIService.getEventList(unixStartTime, unixEndTime);
    if (response.data.code != 0) {
      return errorMessageResponse(response.data.msg);
    }
    ///
    const schedule = mappingSlotAvailable(date, response.data.data.items ?? []);
    return successResponse({data: schedule});
  }

  public async create(payload: BookingPayloadRequest) {

    const schedule = await this.validationSchedule(
      payload.date,
      payload.slot,
      payload.timezone
    );
    if (!schedule) {
      return errorMessageResponse(MESSAGES.BOOKING.NOT_AVAILABLE);
    }
    /// create brand
    const brand: any = await brandService.create({
      name: payload.brand_name,
      first_name: payload.name,
      last_name: "",
      email: payload.email
    })
    if (brand.statusCode !== 200) {
      return errorMessageResponse(brand.message ?? MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    // create lark event
    let larkEvent: CreateEventResponse['data']['event'];
    try {
      larkEvent = await larkOpenAPIService.createEvent({
        summary: `TISC product demo with ${payload.name}`,
        description: `Brand: ${payload.brand_name}\nWebsite: ${payload.website}`,
        start_time: {
          timestamp: schedule.bookedStartTime,
          timezone: payload.timezone,
        },
        end_time: {
          timestamp: schedule.bookedEndTime,
          timezone: payload.timezone
        }
      }, [
        {type: 'user', user_id: ENVIROMENT.LARK_USER_ID},
        {type: 'third_party',  third_party_email: payload.email},
      ]);
    } catch {
      await this.removeBrandData(brand.data.id);
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }
    //
    const booking = await bookingRepository.create({
      brand_id: brand.data.id,
      event_id: larkEvent.event_id,
      website: payload.website,
      meeting_url: larkEvent.vchat.meeting_url,
      email: payload.email,
      name: payload.name,
      date: payload.date,
      timezone: payload.timezone,
      slot: payload.slot,
    })

    if (!booking) {
      await larkOpenAPIService.deleteEvent(larkEvent.event_id);
      await this.removeBrandData(brand.data.id);
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    // sent email
    const sent = await this.sendEmail(schedule.startTime, booking);
    if (!sent) {
      await this.removeBrandData(brand.data.id);
      await larkOpenAPIService.deleteEvent(larkEvent.event_id);
      return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
    }

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async reSchedule(id: string, payload: ReScheduleBookingPayloadRequest) {

    const booking = await bookingRepository.find(id);
    if (!booking) {
      return errorMessageResponse(MESSAGES.BOOKING.NOT_FOUND, 404);
    }
    ///
    if (
      booking.slot === payload.slot &&
      booking.date === payload.date &&
      booking.timezone === payload.timezone
    ) {
      return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
    }
    //
    const schedule = await this.validationSchedule(payload.date, payload.slot, payload.timezone);
    if (!schedule) {
      return errorMessageResponse(MESSAGES.BOOKING.NOT_AVAILABLE);
    }
    //
    const response = await larkOpenAPIService.updateEvent(
      booking.event_id,
      {
        start_time: {
        timestamp: schedule.unixStartTime,
        timezone: payload.timezone,
        },
        end_time: {
          timestamp: schedule.unixEndTime,
          timezone: payload.timezone
        }
      }
    )
    if (response.data.code != 0) {
      return errorMessageResponse(response.data.msg);
    }

    const updatedBooking = await bookingRepository.update(id, {
      event_id: response.data.data.event.event_id,
      meeting_url: response.data.data.event.vchat.meeting_url,
      date: payload.date,
      timezone: payload.timezone,
      slot: payload.slot,
    })

    if (!updatedBooking) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }

    // sent email
    const sent: boolean|any = await this.sendEmail(schedule.startTime, updatedBooking);
    if (!sent) {
      return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
    }

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async get(id: string) {
    const booking = await bookingRepository.getModel()
      .select('bookings.*', 'brands.name as brand_name')
      .join('brands', 'brands.id', '==', 'bookings.brand_id')
      .where('bookings.id', '==', id)
      .first();
    if (!booking) {
      return errorMessageResponse(MESSAGES.BOOKING.NOT_FOUND, 404);
    }
    return successResponse({data: booking});
  }

  public async cancel(id: string) {
    //
    const booking = await bookingRepository.find(id);
    if (!booking) {
      return errorMessageResponse(MESSAGES.BOOKING.NOT_FOUND, 404);
    }
    // cancel lark booking
    await larkOpenAPIService.deleteEvent(booking.event_id)
    await bookingRepository.delete(id);
    await this.removeBrandData(booking.brand_id);
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  private async validationSchedule(date: string, slotTime: SlotTime, timezone: Timezones) {
      let response = await this.availableSchedule(date) as any;
      if (response.statusCode === 400) {
        return false;
      }
      const schedules = response.data as ScheduleTime[];
      const schedule = schedules.find((sche) => sche.slot === slotTime && sche.available);
      if (schedule) {
        //
        const startTime = moment(`${date} ${schedule.start}+08:00`);
        const endTime = moment(`${date} ${schedule.end}+08:00`);
        const bookedStartTime = startTime.tz(timezone);
        const bookedEndTime = endTime.tz(timezone);
        ///
        return {
          ...schedule,
          startTime,
          endTime,
          unixStartTime: startTime.format('X'),
          unixEndTime: endTime.format('X'),
          bookedStartTime: bookedStartTime.format('X'),
          bookedEndTime: bookedEndTime.format('X'),
        };
      }
      return false;
  }

  private async sendEmail(startTime: moment.Moment, booking: BookingAttributes) {
    ///
    const sgFulltime = startTime.format('HH:mm on dddd, MMMM DD, YYYY');
    //
    const bookingTime = startTime.tz(booking.timezone);
    const bookingFulltime = bookingTime.format('HH:mm on dddd, MMMM DD, YYYY');

    const schedule_url = `${ENVIROMENT.FE_URL}/booking/${booking.id}/re-schedule`;
    const cancel_url = `${ENVIROMENT.FE_URL}/booking/${booking.id}/cancel`;
    //
    const subject = `TISC product demo with ${booking.name}`;
    ///
    await mailService.sendBookingScheduleEmail({
      to: booking.email,
      first_name: booking.name,
      start_time: bookingFulltime,
      conference_url: booking.meeting_url,
      reschedule_url: schedule_url,
      cancel_url: cancel_url,
      subject,
      timezone: TimeZoneText[booking.timezone]
    });
    ///
    // await mailService.sendBookingScheduleEmail({
    //   to: ENVIROMENT.ADMIN_EMAIL_ADDRESS,
    //   first_name: "Liming Rao",
    //   start_time: sgFulltime,
    //   conference_url: booking.meeting_url,
    //   reschedule_url: schedule_url,
    //   cancel_url: cancel_url,
    //   subject,
    //   timezone: TimeZoneText['Asia/Singapore']
    // });
    return true;
  }

  private async removeBrandData(brandId: string) {
    await brandRepository.delete(brandId);
    await userRepository.deleteBy({
      relation_id: brandId
    });
    await locationRepository.deleteBy({
      relation_id: brandId
    });
    return true;
  }
}

export const bookingService = new BookingService();
