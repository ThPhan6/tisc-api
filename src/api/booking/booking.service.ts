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
  ScheduleTime,
  BookingPayloadRequest,
  SlotTime,
  Timezones,
} from "./booking.type";
import {CreateEventResponse} from '@/types/lark.type';
import {mappingSlotAvailable} from './booking.mapping';
import { brandService } from "../brand/brand.service";

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
        summary: `${payload.brand_name} book TISC live demo session`,
        description: "TISC live demo session is booked",
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
          unixStartTime: startTime.format('X'),
          unixEndTime: endTime.format('X'),
          bookedStartTime: bookedStartTime.format('X'),
          bookedEndTime: bookedEndTime.format('X'),
        };
      }
      return false;
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
