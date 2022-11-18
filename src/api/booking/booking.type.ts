export interface IScheduleSlot {
  start: string;
  end: string;
  available: boolean;
}

export const BOOKING_SCHEDULE: IScheduleSlot[] = [
  {
    start: '08:00:00 AM',
    end: '09:00:00 AM',
    available: true,
  },
  {
    start: '09:00:00 AM',
    end: '10:00:00 AM',
    available: true,
  },
  {
    start: '10:00:00 AM',
    end: '11:00:00 AM',
    available: true,
  },
  {
    start: '11:00:00 AM',
    end: '12:00:00 AM',
    available: true,
  },
  {
    start: '02:00:00 PM',
    end: '03:00:00 PM',
    available: true,
  },
  {
    start: '03:00:00 PM',
    end: '04:00:00 PM',
    available: true,
  },
  {
    start: '04:00:00 PM',
    end: '05:00:00 PM',
    available: true,
  },
  {
    start: '05:00:00 PM',
    end: '06:00:00 PM',
    available: true
  }
]

export const SG_TIMEZONE = "Asia/Singapore";
export const BOOKING_DT_FORMAT = "YYYY-MM-DD hh:mm:ss A";

export interface IBookingRequest {
  brand: string,
  website: string,
  first_name: string,
  email: string,
  date: string,
  start_time: string,
  end_time: string,
  timezone: string,
}

export interface IReScheduleBookingRequest {
  date: string,
  start_time: string,
  end_time: string,
  timezone: string,
}

export interface IResponseInBooking {
  data?: any,
  message?: string,
  statusCode: number,
}

export interface IResponseBrandInBooking {
  id?: string,
  message?: string,
  statusCode: number,
}



export interface IScheduleValidation {
  date: string,
  timezone: string,
  start_time: string,
  end_time: string,
}

export interface IBookingEvent {
  attendee_ability: string,
  create_time: string,
  description: string,
  end_time: {
    date: string,
    timezone: string,
  },
  event_id: string,
  organizer_calendar_id: string,
  start_time: {
    date: string,
    timezone: string
  },
  status: string,
  summary: string,
  visibility: string
}