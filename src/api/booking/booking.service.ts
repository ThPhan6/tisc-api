import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import { bookingRepository } from "@/repositories/booking.repository";
import { larkOpenAPIService } from "@/service/lark.service";
import moment_tz from "moment-timezone";
import moment from 'moment';
import {
  BOOKING_DT_FORMAT,
  BOOKING_SCHEDULE,
  IBookingEvent,
  IBookingRequest,
  IReScheduleBookingRequest,
  IResponseBrandInBooking,
  IResponseInBooking,
  IScheduleSlot,
  IScheduleValidation,
} from "./booking.type";
import { IBookingAttributes } from "@/types";
import { mailService } from "@/service/mail.service";
import { brandService } from "../brand/brand.service";

export default class BookingService {
  public async availableSchedule(date: string) {
    const numberOfWeek = moment(date).isoWeekday();
    if (numberOfWeek == 6 || numberOfWeek == 7) {
      return errorMessageResponse(MESSAGES.BOOKING.SCHEDULE_NOT_AVAILABLE);
    }

    const selectedDate = moment(date).format('YYYY-MM-DD');
    const selectedDateStartTs = moment(`${selectedDate} 08:00:00 AM`, BOOKING_DT_FORMAT)
      .format("X"); // start -> 08:00:00 AM
    const selectedDateEndTs = moment(`${selectedDate} 06:00:00 PM`, BOOKING_DT_FORMAT)
      .format("X"); // end -> 06:00:00 PM

    try {
      const response = await larkOpenAPIService.getEventList(selectedDateStartTs, selectedDateEndTs);
      if (response.data.code != 0) {
        return errorMessageResponse(response.data.msg);
      }

      let schedule: IScheduleSlot[] = BOOKING_SCHEDULE;
      const events: IBookingEvent[] = response.data.data.items;
      if (events?.length > 0) {
        let newSchedule: any = [];
        schedule.map((item: any) => {
          events.map((event: any) => {
            if (!event?.status || event?.status != 'cancelled') {
              const scheduleStartTs = moment(`${selectedDate} ${item.start}`, BOOKING_DT_FORMAT)
                .tz(event.start_time.timezone).format('X');
              const scheduleEndTs = moment(`${selectedDate} ${item.end}`, BOOKING_DT_FORMAT)
                .tz(event.end_time.timezone).format('X');
              if (scheduleStartTs == event.start_time.timestamp
                || (scheduleEndTs >= event.start_time.timestamp && scheduleEndTs <= event.end_time.timestamp)
                || (scheduleStartTs >= event.start_time.timestamp && scheduleStartTs <= event.end_time.timestamp)) {
                item.available = false;
              }
            }
          })
          newSchedule.push(item);
        })
        schedule = newSchedule;
      }

      const today = moment().format('YYYY-MM-DD');
      if (selectedDate == today) {
        // filter by time today
        const dtNowTs = moment().format('X');
        let newSchedule: any = [];
        schedule.map((item: any) => {
          const scheduleStartTs = moment(`${selectedDate} ${item.start}`).format('X');
          if (scheduleStartTs <= dtNowTs) {
            item.available = false;
          }
          newSchedule.push(item);
        })
        schedule = newSchedule;
      }

      return successResponse({data: schedule});

    } catch (error : any) {
      console.log(error)
      return errorMessageResponse(error?.data?.msg ?? MESSAGES.GENERAL.SOMETHING_WRONG);
    }
  }

  public async create(payload: IBookingRequest) {
    const numberOfWeek = moment(payload.date).isoWeekday();
    if (numberOfWeek == 6 || numberOfWeek == 7) {
      return errorMessageResponse(MESSAGES.BOOKING.SCHEDULE_NOT_AVAILABLE);
    }

    const startTimestamp = moment(payload.start_time, "X");
    const endTimestamp = moment(payload.end_time, "X");
    if (!startTimestamp.isValid() || !endTimestamp.isValid()) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.NOT_VALID);
    }

    const todayTimestamp = moment().tz(payload.timezone).format("X");
    if (parseInt(payload.start_time) >= parseInt(payload.end_time)
      || parseInt(payload.start_time) <= parseInt(todayTimestamp)) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.LARGE_THAN);
    }

    try {
      const message: string = await this.validationSchedule(payload);
      if (message != '') {
        return errorMessageResponse(message);
      }

      // create lark event
      const response = await larkOpenAPIService.createEvent({
        summary: `${payload.brand} book TISC live demo session`,
        description: "TISC live demo session is booked",
        start_time: {
          timestamp: payload.start_time,
          timezone: payload.timezone,
        },
        end_time: {
          timestamp: payload.end_time,
          timezone: payload.timezone
        },
        vchat: {
          vc_type: 'vc'
        }
      });
      if (response.data.code != 0) {
        return errorMessageResponse(response.data.msg);
      }

      const brandReponse: IResponseBrandInBooking = await brandService.create({
        name: payload.brand,
        first_name: payload.first_name,
        last_name: "",
        email: payload.email
      }, false)

      if (brandReponse.statusCode !== 200) {
        await larkOpenAPIService.deleteEvent(response.data.data.event.event_id)
        return errorMessageResponse(brandReponse.message ?? MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
      }

      const booking = await bookingRepository.create({
        brand_id: brandReponse.id,
        event_id: response.data.data.event.event_id,
        meeting_url: response.data.data.event.vchat.meeting_url,
        email: payload.email,
        full_name: payload.first_name,
        date: payload.date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        timezone: payload.timezone,
      })

      if (!booking) {
        return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
      }

      // sent email
      const sent: boolean|any = await this.sendEmail(startTimestamp, booking, payload.timezone);
      if (!sent) {
        return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
      }

      return successMessageResponse(MESSAGES.GENERAL.SUCCESS);

    } catch (error: any) {
      console.log(error)
      return errorMessageResponse(error?.data?.msg ?? MESSAGES.GENERAL.SOMETHING_WRONG);
    }
  }

  public async reSchedule(id: string, payload: IReScheduleBookingRequest) {
    const numberOfWeek = moment(payload.date).isoWeekday();
    if (numberOfWeek == 6 || numberOfWeek == 7) {
      return errorMessageResponse(MESSAGES.BOOKING.SCHEDULE_NOT_AVAILABLE);
    }

    const startTimestamp = moment(payload.start_time, "X");
    const endTimestamp = moment(payload.end_time, "X");

    if (!startTimestamp.isValid() || !endTimestamp.isValid()) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.NOT_VALID);
    }

    const todayTimestamp = moment().tz(payload.timezone).format("X");

    if (parseInt(payload.start_time) >= parseInt(payload.end_time)
      || parseInt(payload.start_time) <= parseInt(todayTimestamp)) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.LARGE_THAN);
    }

    try {
      const message: string = await this.validationSchedule(payload);
      if (message != '') {
        return errorMessageResponse(message);
      }

      let booking:any = await bookingRepository.find(id);
      if (!booking) {
        return errorMessageResponse(MESSAGES.BOOKING.NOT_FOUND, 404);
      }

      const response = await larkOpenAPIService.updateEvent(
        booking.event_id,
        {
          start_time: {
          timestamp: payload.start_time,
          timezone: payload.timezone,
          },
          end_time: {
            timestamp: payload.end_time,
            timezone: payload.timezone
          }
        }
      )
      if (response.data.code != 0) {
        return errorMessageResponse(response.data.msg);
      }

      booking = await bookingRepository.update(id, {
        event_id: response.data.data.event.event_id,
        meeting_url: response.data.data.event.vchat.meeting_url,
        date: payload.date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        timezone: payload.timezone,
      })

      if (!booking) {
        return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
      }

      // sent email
      const sent: boolean|any = await this.sendEmail(startTimestamp,  booking, payload.timezone);
      if (!sent) {
        return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
      }

      return successMessageResponse(MESSAGES.GENERAL.SUCCESS);

    } catch (error: any) {
      console.log(error)
      return errorMessageResponse(error?.data?.msg ?? MESSAGES.GENERAL.SOMETHING_WRONG);
    }
  }

  public async cancel(id: string) {
    try {
      const booking = await bookingRepository.find(id);
      if (!booking) {
        return errorMessageResponse(MESSAGES.BOOKING.NOT_FOUND, 404);
      }

      // cancel lark booking
      await larkOpenAPIService.deleteEvent(booking.event_id)
      await bookingRepository.delete(id)

      return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
    } catch (error: any) {
      console.log(error)
      return errorMessageResponse(error?.statusText ?? MESSAGES.GENERAL.SOMETHING_WRONG);
    }
  }

  private async validationSchedule(payload: IScheduleValidation) {
    const selectedDate = moment(payload.date).format('YYYY-MM-DD');
      let response: IResponseInBooking = await this.availableSchedule(selectedDate);
      if (response?.data?.length == 0 || !response) {
        return MESSAGES.BOOKING.NOT_AVAILABLE;
      }

      let valid = false;
      (response.data).map((item: any) => {
        const scheduleStartTs = moment(`${selectedDate} ${item.start}`, BOOKING_DT_FORMAT)
          .tz(payload.timezone).format("X");
        const scheduleEndTs = moment(`${selectedDate} ${item.end}`, BOOKING_DT_FORMAT)
        .tz(payload.timezone).format("X");
        if ((payload.start_time == scheduleStartTs || payload.end_time == scheduleEndTs)
          && item.available) {
          valid = true
        }
      })

      if (!valid) {
        return MESSAGES.BOOKING.NOT_AVAILABLE;
      }

      return '';
  }

  private async sendEmail(startTimestamp: any, booking: IBookingAttributes, timezone: string) {
    try {
      const sgStartTime = moment(moment(startTimestamp, "X")
      .tz(timezone)).tz('Asia/Singapore')
      .format('hh:mm on dddd, MMMM DD, YYYY')

    const schedule_url = "http://localhost:3000";
    const cancel_url = "http://localhost:3000";
    const subject = "TISC live demo session is booked!";

    const sentToBrand = mailService.sendBookingScheduleEmail(
      booking.email,
      subject,
      booking.full_name,
      sgStartTime,
      booking.meeting_url,
      schedule_url,
      cancel_url
    );

    const sentToTISC = mailService.sendBookingScheduleEmail(
      "liming@tisc.global",
      subject,
      "Liming",
      sgStartTime,
      booking.meeting_url,
      schedule_url,
      cancel_url
    );

    await Promise.all([sentToBrand, sentToTISC]);
    return true;
    } catch (error) {
      return false;
    }
  }

}
export const bookingService = new BookingService();
