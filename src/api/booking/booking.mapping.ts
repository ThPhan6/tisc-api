import { CalendarEventResponse } from "@/types/lark.type";
import "moment-timezone";
import moment from "moment";
import { ScheduleTime, Timezones } from "./booking.type";
import { cloneDeep } from "lodash";

export const mappingSlotAvailable = (
  clientDate: string,
  clientTimezone: Timezones,
  events: CalendarEventResponse[],
  clientSchedule: ScheduleTime[]
) => {
  /// filter existed events
  return cloneDeep(clientSchedule).map((item) => {
    const startTime = moment
      .tz(`${clientDate} ${item.start}`, clientTimezone)
      .tz(Timezones.Singapore_Standard_Time)
      .format("X");
    const endTime = moment
      .tz(`${clientDate} ${item.end}`, clientTimezone)
      .tz(Timezones.Singapore_Standard_Time)
      .format("X");
    events.forEach((event) => {
      if (!event.status || event?.status != "cancelled") {
        if (
          startTime == event.start_time.timestamp ||
          (endTime > event.start_time.timestamp &&
            endTime <= event.end_time.timestamp) ||
          (startTime >= event.start_time.timestamp &&
            startTime < event.end_time.timestamp)
        ) {
          item.available = false;
        }
      }
    });
    return item;
  });
};
