import { Timezones } from "@/constants";
import { getEnumValues } from "@/helper/common.helper";
import {
  errorMessage,
  requireBookingDateValidation,
  requireEmailValidation,
  requireStringValidation
} from "@/validate/common.validate";
import Joi from "joi";

const timezoneValidation = Joi
  .valid(...getEnumValues(Timezones))
  .required()
  .error(errorMessage("Time zone is not valid"));

export default {
  availableSchedule: {
    query: {
      date: requireBookingDateValidation(0, 90),
    }
  },
  create: {
    payload: {
      brand: requireStringValidation('brand'),
      website: requireStringValidation('website'),
      first_name: requireStringValidation('first_name'),
      date: requireBookingDateValidation(0, 90),
      email: requireEmailValidation(),
      start_time: requireStringValidation('Start time'),
      end_time: requireStringValidation('End time'),
      timezone: timezoneValidation
    },
  },
  reSchedule: {
    params: {
      id: requireStringValidation("Booking"),
    },
    payload: {
      date: requireBookingDateValidation(0, 90),
      start_time: requireStringValidation('Start time'),
      end_time: requireStringValidation('End time'),
      timezone: timezoneValidation
    }
  },
  cancel: {
    params: {
      id: requireStringValidation("Booking"),
    }
  },
};
