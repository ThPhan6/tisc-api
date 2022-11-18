import { BrandRoles, BRAND_STATUSES, MESSAGES } from "@/constants";
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
import { IBookingAttributes, UserAttributes, UserStatus, UserType } from "@/types";
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

    const todayTimestamp = moment_tz().tz(payload.timezone).format("X");
    if (parseInt(payload.start_time) >= parseInt(payload.end_time)
      || parseInt(payload.start_time) <= parseInt(todayTimestamp)) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.LARGE_THAN);
    }

    try {
      const message = await this.validationSchedule(payload);
      if (!isEmpty(message)) {
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

      const brand: any = await this.createBrand({
        name: payload.brand,
        first_name: payload.first_name,
        last_name: "",
        email: payload.email
      })

      if (isEmpty(brand)) {
        await larkOpenAPIService.deleteEvent(response.data.data.event.event_id)
        return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
      }

      // create booking
      const booking = await this.bookingRepository.create({
        brand_id: brand.id,
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
    if (isEmpty(moment.tz.zone(payload.timezone))) {
      return errorMessageResponse(MESSAGES.BOOKING.TIMEZONE.NOT_VALID);
    }

    const startTimestamp = moment(payload.start_time, "X");
    const endTimestamp = moment(payload.end_time, "X");

    if (!startTimestamp.isValid() || !endTimestamp.isValid()) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.NOT_VALID);
    }

    const todayTimestamp = moment_tz().tz(payload.timezone).format("X");
    if (parseInt(payload.start_time) >= parseInt(payload.end_time)
      || parseInt(payload.start_time) <= parseInt(todayTimestamp)) {
      return errorMessageResponse(MESSAGES.BOOKING.TIME_STAMP.LARGE_THAN);
    }

    try {
      const message = await this.validationSchedule(payload);
      if (!isEmpty(message)) {
        return errorMessageResponse(message);
      }

      let booking:any = await this.bookingRepository.find(id);
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

      booking = await this.bookingRepository.update(id, {
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

  private async validationSchedule(payload: any) {
    const selectedDate = moment(payload.date).format('YYYY-MM-DD');
      let response: any = await this.availableSchedule(payload.timezone, selectedDate);
      if (response?.data?.length == 0 || !response) {
        return MESSAGES.BOOKING.NOT_AVAILABLE;
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
        return MESSAGES.BOOKING.NOT_AVAILABLE;
      }

      return '';
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
          UserType.Brand,
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
          role_id: BrandRoles.Admin,
          verification_token: verificationToken,
          is_verified: false,
          status: UserStatus.Pending,
          type: UserType.Brand,
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
