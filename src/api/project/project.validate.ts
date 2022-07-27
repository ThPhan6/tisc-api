import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      code: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project code is required")),
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project name is required")),
      country_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
      state_id: Joi.string().trim(),
      city_id: Joi.string().trim(),
      address: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Address is required")),
      postal_code: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Postal code is required")),
      project_type_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project type is required")),
      building_type_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Building type is required")),
      measurement_unit: Joi.number()
        .required()
        .error(
          commonFailValidatedMessageFunction("Measurement unit is required")
        ),
      design_due: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Design due is required")),
      construction_start: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Construction start is required")
        ),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Quote id is required")),
    },
    payload: {
      author: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Author is required")),
      identity: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Identity is required")),
      quotation: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Quote is required")),
    },
  },
};
