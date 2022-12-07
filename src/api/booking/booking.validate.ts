import Joi from "joi";
import { getEnumValues } from "@/helper/common.helper";
import {
  customErrorMessages,
  errorMessage,
  requireDateValidation,
  requireEmailValidation,
  requireStringValidation,
} from "@/validate/common.validate";
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
  const min = moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss");
  const max = moment().add(90, "days").format("YYYY-MM-DD HH:mm:ss");
  const sche = BookingSchedule.find((item) => item.slot === value.slot);
  const temp = moment(value.date).format("YYYY-MM-DD");
  const bookingDate = moment(`${temp} ${sche?.start || "00:00:00"}`);
  if (!bookingDate.isBetween(min, max))
    return helpers.message({
      custom: `A valid date and slot must be between ${min} and ${max}`,
    });
  return { ...value, date: temp };
};
export default {
  availableSchedule: {
    query: {
      date: requireDateValidation(1, 90),
    },
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
