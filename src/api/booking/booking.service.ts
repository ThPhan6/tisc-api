import { BRAND_STATUSES, MESSAGES, ROLES, SYSTEM_TYPE } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import BookingRepository from "@/repositories/booking.repository";
import { larkOpenAPIService } from "@/service/lark.service";
import moment_tz from "moment-timezone";
import moment from 'moment';
import {
  BOOKING_SCHEDULE,
  IBookingRequest,
  IReScheduleBookingRequest,
} from "./booking.type";
import { isEmpty } from "lodash";
import BrandRepository from "@/repositories/brand.repository";
import { BrandAttributes, IBrandRequest } from "../brand/brand.type";
import UserRepository from "@/repositories/user.repository";
import { locationService } from "../location/location.service";
import { createResetPasswordToken } from "@/helper/password.helper";
import { UserAttributes, UserStatus } from "@/types";
import { mailService } from "@/service/mail.service";

export default class BookingService {
  private bookingRepository: BookingRepository;
  private brandRepository: BrandRepository;
  private userRepository: UserRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
    this.brandRepository = new BrandRepository();
    this.userRepository = new UserRepository();
  }

  public async availableSchedule(timezone: string, date: string) {
    if (isEmpty(moment.tz.zone(timezone))) {
      return errorMessageResponse(MESSAGES.BOOKING.TIMEZONE.NOT_VALID);
    }

    // get timestamp for selected date start -> 08:00:00 AM, end -> 06:00:00 PM
    const selectedDate = moment(date).format('YYYY-MM-DD');
    const selectedDateStartTs = moment_tz(new Date(`${selectedDate} 08:00:00 AM GMT+8`))
      .tz(timezone).format('X');
    const selectedDateEndTs = moment_tz(new Date(`${selectedDate} 06:00:00 PM GMT+8`))
      .tz(timezone).format('X');

    try {
      const response = await larkOpenAPIService.getEventList(selectedDateStartTs, selectedDateEndTs);
      if (response.data.code != 0) {
        return errorMessageResponse(response.data.msg);
      }

      let schedule: any = BOOKING_SCHEDULE;

      // filter by events
      const events = response.data.data.items;
      if (events?.length > 0) {
        let newSchedule: any = [];
        schedule.map((item: any) => {
          const scheduleStart = new Date(`${selectedDate} ${item.start} GMT+8`);
          events.map((event: any) => {
            if (!event?.status || event?.status != 'cancelled') {
              const scheduleStartTs =  moment_tz(scheduleStart).tz(event.start_time.timezone).format('X');
              console.log(event.start_time.timestamp)
              if (scheduleStartTs == event.start_time.timestamp) {
                item.available = false;
              }
            }
          })
          newSchedule.push(item);
        })
        schedule = newSchedule;
      }

      const today = moment_tz().tz(timezone).format('YYYY-MM-DD');
      if (selectedDate == today) {
        // filter by time today
        const dtNowTs = moment_tz().tz(timezone).format('X');
        let newSchedule: any = [];
        schedule.map((item: any) => {
          const scheduleStart = new Date(`${selectedDate} ${item.start} GMT+8`);
          const scheduleStartTs = moment_tz(scheduleStart).tz(timezone).format('X');
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
    if (isEmpty(moment.tz.zone(payload.timezone))) {
      return errorMessageResponse(MESSAGES.BOOKING.TIMEZONE.NOT_VALID);
    }

    const startTimestamp = moment(payload.start_time, "X");
    const endTimestamp = moment(payload.end_time, "X");
    if (!startTimestamp.isValid() || !endTimestamp.isValid()) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.NOT_VALID);
    }

    if (endTimestamp <= startTimestamp) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.LARGE_THAN);
    }

    try {
      const selectedDate = moment(payload.date).format('YYYY-MM-DD');
      // get available schedule
      let response: any = await this.availableSchedule(payload.timezone, selectedDate);
      if (response?.data?.length == 0 || !response) {
        return errorMessageResponse(MESSAGES.BOOKING.NOT_AVAILABLE);
      }

      let valid = false;
      (response.data).map((item: any) => {
        const scheduleStartTs = moment_tz(new Date(`${selectedDate} ${item.start} GMT+8`))
          .tz(payload.timezone).format('X');
        const scheduleEndTs = moment_tz(new Date(`${selectedDate} ${item.end} GMT+8`))
          .tz(payload.timezone).format('X');
        if ((payload.start_time == scheduleStartTs || payload.end_time == scheduleEndTs)
          && item.available) {
          valid = true
        }
      })

      if (!valid) {
        return errorMessageResponse(MESSAGES.BOOKING.NOT_AVAILABLE);
      }

      // create lark event
      response = await larkOpenAPIService.createEvent({
        summary: `${payload.brand} book TISC live demo session`,
        description: "TISC live demo session is booked",
        start_time: {
          timestamp: payload.start_time,
          timezone: payload.timezone,
        },
        end_time: {
          timestamp: payload.end_time,
          timezone: payload.timezone
        }
      });
      if (response.data.code != 0) {
        return errorMessageResponse(response.data.msg);
      }

      const brand: any = await this.createBrand({
        name: payload.brand,
        first_name: payload.first_name,
        last_name: "",
        email: payload.email
      })

      if (isEmpty(brand)) {
        // delete event
        await larkOpenAPIService.deleteEvent(response.data.data.event.event_id)
        return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
      }

      // create booking
      const booking = await this.bookingRepository.create({
        brand_id: brand.id,
        event_id: response.data.data.event.event_id,
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

      // send email
      const sgStartTime = moment(moment(startTimestamp, 'X')
        .tz(payload.timezone)).tz('Asia/Singapore')
        .format('hh:mm on dddd, MMMM DD, YYYY')
      const sent = await mailService.sendBookingScheduleEmail(
        payload.email,
        "TISC live demo session is booked!",
        payload.first_name,
        sgStartTime,
        "#",
        "#",
        "#"
      );

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
    if (isEmpty(moment.tz.zone(payload.timezone))) {
      return errorMessageResponse(MESSAGES.BOOKING.TIMEZONE.NOT_VALID);
    }

    const startTimestamp = moment(payload.start_time, "X");
    const endTimestamp = moment(payload.end_time, "X");
    if (!startTimestamp.isValid() || !endTimestamp.isValid()) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.NOT_VALID);
    }

    if (endTimestamp <= startTimestamp) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.LARGE_THAN);
    }

    let booking:any = await this.bookingRepository.find(id);
    if (!booking) {
      return errorMessageResponse(MESSAGES.BOOKING.NOT_FOUND, 404);
    }

    // update to lark
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

    booking = await this.bookingRepository.update(booking.id, {
      event_id: response.data.data.event.event_id,
      date: payload.date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      timezone: payload.timezone,
    })

    if (!booking) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }

     // send email
     const sgStartTime = moment(moment(startTimestamp, 'X')
     .tz(payload.timezone)).tz('Asia/Singapore')
     .format('hh:mm on dddd, MMMM DD, YYYY')
   const sent = await mailService.sendBookingScheduleEmail(
     booking.email,
     "TISC live demo session is booked!",
     booking.first_name,
     sgStartTime,
     "#",
     "#",
     "#"
   );

   if (!sent) {
     return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
   }

   return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async cancel(id: string) {
    try {
      const booking = await this.bookingRepository.find(id);
      if (!booking) {
        return errorMessageResponse(MESSAGES.BOOKING.NOT_FOUND, 404);
      }

      // cancel lark booking
      await larkOpenAPIService.deleteEvent(booking.event_id)
      await this.bookingRepository.delete(id);

      return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
    } catch (error: any) {
      console.log(error)
      return errorMessageResponse(error?.data?.msg ?? MESSAGES.GENERAL.SOMETHING_WRONG);
    }
  }

  private async createBrand(payload: IBrandRequest) {
    try {
      let brand: BrandAttributes|undefined = await this.brandRepository.findBy({
        name: payload.name,
      });

      if (!brand) {
        brand = await this.brandRepository.create({
          name: payload.name,
          status: BRAND_STATUSES.PENDING,
        });

        if (!brand) {
          return null;
        }
      }

      let user: UserAttributes|undefined = await this.userRepository.findBy({
        email: payload.email,
      });

      if (!user) {
        const defaultLocation = await locationService.createDefaultLocation(
          brand.id,
          SYSTEM_TYPE.BRAND,
          payload.email
        );

        let verificationToken: string;
        let isDuplicated = true;
        do {
          verificationToken = createResetPasswordToken();
          const duplicateVerificationTokenFromDb = await this.userRepository.findBy({
            verification_token: verificationToken,
          });
          if (!duplicateVerificationTokenFromDb) isDuplicated = false;
        } while (isDuplicated);

        const user = await this.userRepository.create({
          firstname: payload.first_name,
          lastname: payload.last_name,
          gender: true,
          email: payload.email,
          role_id: ROLES.BRAND_ADMIN,
          verification_token: verificationToken,
          is_verified: false,
          status: UserStatus.Pending,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand.id,
          location_id: defaultLocation?.id,
        });

        if (!user) {
          return null;
        }
      }
      return brand;
    } catch (error) {
      return null;
    }
  }

}
export const bookingService = new BookingService();
