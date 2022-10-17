import Joi from "joi";
import { commonFailValidatedMessageFunction } from "@/validate/common.validate";

export default {
  getStates: {
    query: {
      country_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Country id is required")),
    },
  },
  getCities: {
    query: {
      country_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Country id is required")),
      state_id: Joi.string(),
    },
  },
  findById: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id is required")),
    },
  },
  getCommonTypes: {
    params: {
      type: Joi.number()
        .required()
        .error(commonFailValidatedMessageFunction("Type is required")),
      sort_order: Joi.string().valid("ASC", "DESC").allow(""),
    },
  },
};
