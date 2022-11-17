export const BOOKING_SCHEDULE = [
  {
    start: '08:00 AM',
    end: '09:00 AM',
    available: true,
  },
  {
    start: '09:00 AM',
    end: '10:00 AM',
    available: true,
  },
  {
    start: '10:00 AM',
    end: '11:00 AM',
    available: true,
  },
  {
    start: '11:00 AM',
    end: '12:00 AM',
    available: true,
  },
  {
    start: '02:00 PM',
    end: '03:00 PM',
    available: true,
  },
  {
    start: '03:00 PM',
    end: '04:00 PM',
    available: true,
  },
  {
    start: '04:00 PM',
    end: '05:00 PM',
    available: true,
  },
  {
    start: '05:00 PM',
    end: '06:00 PM',
    available: true
  }
]

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