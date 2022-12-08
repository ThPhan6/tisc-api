import { CalendarEventResponse } from "@/types/lark.type";
import "moment-timezone";
import moment from 'moment';
import {
  BookingSchedule,
  Timezones
} from "./booking.type";
import {cloneDeep} from 'lodash';

export const mappingSlotAvailable = (
  clientDate: string,
  clientTimezone: Timezones,
  events: CalendarEventResponse[]
) => {
  ///
  // const clientStartTime = moment.tz(clientDate, clientTimezone);
  // const clientEndTime = clientStartTime.clone().endOf('days');
  // /// parse to singapore time
  // const serverStartTime = clientStartTime.clone().tz(Timezones.Singapore_Standard_Time);
  // const serverEndTime = clientEndTime.clone().tz(Timezones.Singapore_Standard_Time);

  /// filter existed events
  return cloneDeep(BookingSchedule).map((item) => {
    const startTime = moment(`${clientDate} ${item.start}+08:00`).format('X');
    const endTime = moment(`${clientDate} ${item.end}+08:00`).format('X');
    events.forEach((event) => {
      if (!event.status || event?.status != 'cancelled') {
        if (
            startTime == event.start_time.timestamp ||
            (endTime > event.start_time.timestamp && endTime <= event.end_time.timestamp) ||
            (startTime >= event.start_time.timestamp && startTime < event.end_time.timestamp)
        ) {
          item.available = false;
        }
      }
    })
    return item;
  });
}
