export enum SlotTime {
  EightToNine = 0,
  NineToTen = 1,
  TenToEleven = 2,
  EleventToTwelve = 3,
  FourteenToFifteen = 4,
  FifteenToSixteen = 5,
  SixteenToSeventeen = 6,
  SeventeenToEighteen = 7,
}

export enum Timezones {
  Central_Europe_Standard_Time = 'Europe/Paris', // GMT +1:00
  East_Europe_Standard_Time = 'Europe/Athens', // GMT +2:00
  East_Africa_Standard_Time = 'Asia/Qatar', // GMT +3:00
  Arabian_Standard_Time = 'Asia/Dubai', // GMT +4:00
  West_Asia_Standard_Time = 'Asia/Tashkent', // GMT +5:00
  Central_Asia_Standard_Time = 'Asia/Dhaka', // GMT +6:00
  South_East_Asia_Standard_Time = 'Asia/Bangkok', // GMT +7:00
  Singapore_Standard_Time = 'Asia/Singapore', // GMT +8:00
  Tokyo_Standard_Time = 'Asia/Tokyo', // GMT +9:00
  West_Pacific_Standard_Time = 'Pacific/Guam', // GMT +10:00
  Central_Pacific_Standard_Time = 'Australia/Sydney', // GMT +11:00
  New_Zealand_Standard_Time = 'Pacific/Fiji', // GMT +12:00
  Midway_Islands_Standard_Time = 'Pacific/Midway', // GMT -11:00
  Hawaii_Standard_Time = 'America/Adak', // GMT -10:00
  Alaska_Standard_Time = 'America/Metlakatla', // GMT -9:00
  Pacific_Standard_Time = 'America/Vancouver', // GMT -8:00
  Mountain_Standard_Time = 'America/Boise', // GMT -7:00
  Central_America_Standard_Time = 'America/Chicago', // GMT -6:00
  Eastern_Standard_Time = 'America/New_York', // GMT -5:00
  Atlantic_Standard_Time = 'America/Dominica', // GMT -4:00
  East_South_America_Standard_Time = 'America/Araguaina', // GMT -3:00
  Mid_Atlantic_Standard_Time = 'Atlantic/South_Georgia', // GMT -2:00
  Central_African_Standard_Time = 'Atlantic/Cape_Verde' // GMT -1:00
}
export enum TimeZoneText {
  'Europe/Paris' = 'GMT +1:00 Central Europe Standard Time',
  'Europe/Athens' = 'GMT +2:00 East Europe Standard Time',
  'Asia/Qatar' = 'GMT +3:00 East Africa Standard Time',
  'Asia/Dubai' = 'GMT +4:00 ',
  'Asia/Tashkent' = 'GMT +5:00 ',
  'Asia/Dhaka' = 'GMT +6:00 ',
  'Asia/Bangkok' = 'GMT +7:00 ',
  'Asia/Singapore' = 'GMT +8:00 ',
  'Asia/Tokyo' = 'GMT +9:00 ',
  'Pacific/Guam' = 'GMT +10:00 ',
  'Australia/Sydney' = 'GMT +11:00 ',
  'Pacific/Fiji' = 'GMT +12:00 ',
  'Pacific/Midway' = 'GMT -11:00 ',
  'America/Adak' = 'GMT -10:00 ',
  'America/Metlakatla' = 'GMT -9:00 ',
  'America/Vancouver' = 'GMT -8:00 ',
  'America/Boise' = 'GMT -7:00 ',
  'America/Chicago' = 'GMT -6:00 ',
  'America/New_York' = 'GMT -5:00 ',
  'America/Dominica' = 'GMT -4:00 ',
  'America/Araguaina' = 'GMT -3:00 ',
  'Atlantic/South_Georgia' = 'GMT -2:00 ',
  'Atlantic/Cape_Verde' = 'GMT -1:00 ',
}


export interface ScheduleTime {
  start: string;
  end: string;
  available: boolean;
  slot: SlotTime;
}

export const BookingSchedule: ScheduleTime[] = [
  {
    start: '08:00:00',
    end: '09:00:00',
    available: true,
    slot: SlotTime.EightToNine,
  },
  {
    start: '09:00:00',
    end: '10:00:00',
    available: true,
    slot: SlotTime.NineToTen,
  },
  {
    start: '10:00:00',
    end: '11:00:00',
    available: true,
    slot: SlotTime.TenToEleven,
  },
  {
    start: '11:00:00',
    end: '12:00:00',
    available: true,
    slot: SlotTime.EleventToTwelve,
  },
  {
    start: '14:00:00',
    end: '15:00:00',
    available: true,
    slot: SlotTime.FourteenToFifteen,
  },
  {
    start: '15:00:00',
    end: '16:00:00',
    available: true,
    slot: SlotTime.FifteenToSixteen,
  },
  {
    start: '16:00:00',
    end: '17:00:00',
    available: true,
    slot: SlotTime.SixteenToSeventeen,
  },
  {
    start: '17:00:00',
    end: '18:00:00',
    available: true,
    slot: SlotTime.SeventeenToEighteen,
  }
];

export interface BookingPayloadRequest {
  brand_name: string,
  website: string,
  name: string,
  email: string,
  date: string,
  slot: SlotTime,
  timezone: Timezones,
}

export interface ReScheduleBookingPayloadRequest extends Pick<
  BookingPayloadRequest, 'date' | 'slot' | 'timezone'
> {}
