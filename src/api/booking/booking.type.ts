export interface IAvailableTimeRequest {
  timezone: string;
  date: string;
}

export const availableSchedule = [
  {
    start: '08:00 AM',
    end: '09:00 AM'
  },
  {
    start: '09:00 AM',
    end: '10:00 AM'
  },
  {
    start: '10:00 AM',
    end: '11:00 AM'
  },
  {
    start: '11:00 AM',
    end: '12:00 AM'
  },
  {
    start: '02:00 PM',
    end: '03:00 PM'
  },
  {
    start: '03:00 PM',
    end: '04:00 PM'
  },
  {
    start: '04:00 PM',
    end: '05:00 PM'
  },
  {
    start: '05:00 PM',
    end: '06:00 PM'
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

export interface IEventBodyParams {
  summary: string,
  description: string,
  start_time: {
    date: string,
    timestamp: string,
    timezone: string,
  },
  end_time: {
    date: string,
    timestamp: string,
    timezone: string,
  }
}