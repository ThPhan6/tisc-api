import { requireBookingDateValidation, requireEmailValidation, requireStringValidation } from "@/validate/common.validate";
import * as Joi from "joi";
import moment from "moment";

export default {
  availableSchedule: {
    query: {
      timezone: requireStringValidation('Time zone'),
      date: requireBookingDateValidation(),
    }
  },
  create: {
    payload: {
      brand: requireStringValidation('brand'),
      website: requireStringValidation('website'),
      first_name: requireStringValidation('first_name'),
      date: requireBookingDateValidation(),
      email: requireEmailValidation(),
      start_time: requireStringValidation('Start time'),
      end_time: requireStringValidation('End time'),
      timezone: requireStringValidation('Time zone'),
    },
  },
  reSchedule: {
    params: {
      id: requireStringValidation("Booking"),
    }
  },
  cancel: {
    params: {
      id: requireStringValidation("Booking"),
    }
  },
};
