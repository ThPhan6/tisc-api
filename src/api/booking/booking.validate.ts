import Joi from "joi";
import { getEnumValues } from "@/helper/common.helper";
import {
  errorMessage,
  requireDateValidation,
  requireEmailValidation,
  requireStringValidation
} from "@/validate/common.validate";
import {SlotTime, Timezones} from './booking.type';

const timezoneValidation = Joi
  .valid(...getEnumValues(Timezones))
  .error(errorMessage("Time zone is not valid"));

const slotTimeValidation = Joi
  .valid(...getEnumValues(SlotTime))
  .error(errorMessage("Slot time is not valid"));

export default {
  availableSchedule: {
    query: {
      date: requireDateValidation(0, 90),
    }
  },
  create: {
    payload: {
      brand_name: requireStringValidation('Brand Name'),
      website: requireStringValidation('website'),
      name: requireStringValidation('Name'),
      date: requireDateValidation(0, 90),
      email: requireEmailValidation(),
      slot: slotTimeValidation,
      timezone: timezoneValidation
    },
  },
  reSchedule: {
    params: {
      id: requireStringValidation("Booking ID"),
    },
    payload: {
      date: requireDateValidation(0, 90),
      slot: slotTimeValidation,
      timezone: timezoneValidation
    }
  },
  Id: {
    params: {
      id: requireStringValidation("Booking ID"),
    }
  },
};
