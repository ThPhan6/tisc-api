import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import BookingRepository from "@/repositories/booking.repository";
import { larkOpenAPIService } from "@/service/lark.service";
import moment_tz from "moment-timezone";
import moment from 'moment';
import { availableSchedule, IAvailableTimeRequest, IBookingRequest, IEventBodyParams } from "./booking.type";
import { isEmpty } from "lodash";

export default class BookingService {
  private bookingRepository: BookingRepository;
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  public availableSchedule(payload: IAvailableTimeRequest) {
    if (isEmpty(moment.tz.zone(payload.timezone))) {
      return errorMessageResponse(MESSAGES.BOOKING.TIMEZONE.NOT_VALID);
    }

    const date = moment(payload.date).format('YYYY-MM-DD');
    const dtStart = new Date(`${date} 08:00 GMT+8`);
    const dtEnd =  new Date(`${date} 18:00 GMT+8`);

    const dtStartTz = moment_tz(dtStart).tz(payload.timezone).format('X')
    const dtEndTz = moment_tz(dtEnd).tz(payload.timezone).format('X')

    const getEventsApi = larkOpenAPIService.getEventList(dtStartTz, dtEndTz);
    getEventsApi.then(response => {
      return successResponse({
        data: availableSchedule
      });
      // if (response.data?.code != 0) {
      //   return errorMessageResponse(response.data.msg);
      // }

      // if (response?.data?.data?.items?.length > 0) {
      //   // const newAvailableSchedule =  availableSchedule.filter(itemSchedule => {
      //     // (response?.data?.data?.items).map((item: any) => {
      //     //     console.log(item);
      //     // })
      //   // })
      //   return successResponse({
      //     data: availableSchedule
      //   });
      // }
      // return successResponse({
      //   data: availableSchedule
      // });
    }).catch((error: any) => {
       return errorMessageResponse(error.getMessage())
    })
  }

  public async create(payload: IBookingRequest) {
    if (isEmpty(moment.tz.zone(payload.timezone))) {
      return errorMessageResponse(MESSAGES.BOOKING.TIMEZONE.NOT_VALID);
    }

    // const dtStart = moment(payload.start_time, 'X');
    // const dtEnd = moment(payload.end_time, "X");

    // if (!dtStart.isValid() || !dtEnd.isValid()) {
    //   return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.NOT_VALID);
    // }

    const body: IEventBodyParams = {
      summary: "TISC Booking",
      description: "TISC have a booking data",
      start_time: {
        date: payload.date,
        timestamp: payload.start_time,
        timezone: payload.timezone,
      },
      end_time: {
        date: payload.date,
        timestamp: payload.end_time,
        timezone: payload.timezone
      }
    }

    try {
      const response = await larkOpenAPIService.createEvent(body);
      console.log(response);
      return successMessageResponse("Success")
    } catch(error: any) {
      console.log(error);
      return errorMessageResponse(error.getMessage())
    }
  }

  public async reSchedule(payload: IAvailableTimeRequest) {

  }

  public async cancel(payload: IAvailableTimeRequest) {

  }

}
export const bookingService = new BookingService();
