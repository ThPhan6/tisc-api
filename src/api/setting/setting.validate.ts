import Joi from "joi";
import {
  requireNumberValidation,
  requireStringValidation,
} from "@/validates/common.validate";

export default {
  getStates: {
    query: {
      country_id: requireStringValidation("Country id"),
    },
  },
  getCities: {
    query: {
      country_id: requireStringValidation("Country id"),
      state_id: Joi.string(),
    },
  },
  findById: {
    params: {
      id: requireStringValidation("Id"),
    },
  },
  getCommonTypes: {
    params: {
      type: requireNumberValidation("Type"),
      sort_order: Joi.string().valid("ASC", "DESC").allow(""),
    },
  },
  getCommonPartnerTypes: {
    query: {
      sort_order: Joi.string().valid("ASC", "DESC").allow(""),
    },
  },
};
