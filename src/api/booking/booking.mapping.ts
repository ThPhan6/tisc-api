import { CalendarEventResponse } from "@/types/lark.type";
import {DefaultTimezone} from '@/config';
import "moment-timezone";
import moment from 'moment';
import {
  BookingSchedule,
} from "./booking.type";
import {cloneDeep} from 'lodash';

export const mappingSlotAvailable = (
  date: string,
  events: CalendarEventResponse[]
) => {
  const currentDateTime = moment().tz(DefaultTimezone).format('X');
  /// filter existed events
  return cloneDeep(BookingSchedule).map((item) => {
    const startTime = moment(`${date} ${item.start}+08:00`).format('X');
    const endTime = moment(`${date} ${item.end}+08:00`).format('X');
    events.forEach((event) => {
      if (!event.status || event?.status != 'cancelled') {
        if (
            startTime == event.start_time.timestamp ||
            (endTime >= event.start_time.timestamp && endTime <= event.end_time.timestamp) ||
            (startTime >= event.start_time.timestamp && startTime < event.end_time.timestamp)
        ) {
          item.available = false;
        }
      }
    })
    /// check current date time
    if (currentDateTime >= startTime) {
      item.available = false;
    }
    //
    return item;
  });
}
