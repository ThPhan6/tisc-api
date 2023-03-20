import Joi from "joi";
import { getEnumValues } from "@/helpers/common.helper";
import {
  customErrorMessages,
  errorMessage,
  requireDateValidation,
  requireEmailValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import {
  BookingPayloadRequest,
  BookingSchedule,
  SlotTime,
  Timezones,
} from "./booking.type";
import moment from "moment";
const timezoneValidation = Joi.valid(...getEnumValues(Timezones)).error(
  errorMessage("Time zone is not valid")
);

const slotTimeValidation = Joi.valid(...getEnumValues(SlotTime)).error(
  errorMessage("Slot time is not valid")
);

const customBookingDateValidation = (
  value: BookingPayloadRequest,
  helpers: Joi.CustomHelpers
) => {
  let clientDate = moment(value.date).format("YYYY-MM-DD");
  const min = moment.tz(value.timezone).add(1, "days");

  const max = moment.tz(value.timezone).add(90, "days");

  const serverSche = BookingSchedule.find(
    (item: any) => item.slot === value.slot
  );
  if (!serverSche) {
    return helpers.message({ custom: "The slot time are not available" });
  }
  const sche = {
    ...serverSche,
    start: moment
      .tz(
        `${clientDate} ${serverSche.start}`,
        Timezones.Singapore_Standard_Time
      )
      .tz(value.timezone)
      .format("HH:mm:ss"),
    end: moment
      .tz(`${clientDate} ${serverSche.end}`, Timezones.Singapore_Standard_Time)
      .tz(value.timezone)
      .format("HH:mm:ss"),
  };

  const bookingDate = moment
    .tz(`${clientDate} ${sche.start}`, value.timezone)
    .clone();
  const bookingDateOfWeekOnServer = bookingDate
    .clone()
    .tz(Timezones.Singapore_Standard_Time)
    .format("ddd");
  if (
    bookingDateOfWeekOnServer === "Sat" ||
    bookingDateOfWeekOnServer === "Sun"
  ) {
    return helpers.message({
      custom: "The slot time are not available",
    });
  }
  if (!bookingDate.isBetween(min, max))
    return helpers.message({
      custom: `Valid date and time must be between ${min.format(
        "YYYY-MM-DD HH:mm:ss"
      )} and ${max.format("YYYY-MM-DD HH:mm:ss")}`,
    });
  return {
    ...value,
    date: moment.tz(clientDate, value.timezone).format("YYYY-MM-DD"),
  };
};
export default {
  availableSchedule: {
    query: Joi.object({
      date: Joi.date().required().custom((value) => {
        return moment(value).format("YYYY-MM-DD")
      }),
      timezone: timezoneValidation,
    }),
  },
  create: {
    payload: Joi.object({
      brand_name: requireStringValidation("Brand Name"),
      website: Joi.string()
        .uri()
        .trim()
        .required()
        .messages(customErrorMessages({ label: "Website" })),
      name: requireStringValidation("Name"),
      date: Joi.date().required(),
      email: requireEmailValidation(),
      slot: slotTimeValidation,
      timezone: timezoneValidation,
    }).custom(customBookingDateValidation),
  },
  reSchedule: {
    params: {
      id: requireStringValidation("Booking ID"),
    },
    payload: Joi.object({
      date: Joi.date().required(),
      slot: slotTimeValidation,
      timezone: timezoneValidation,
    }).custom(customBookingDateValidation),
  },
  Id: {
    params: {
      id: requireStringValidation("Booking ID"),
    },
  },
};
