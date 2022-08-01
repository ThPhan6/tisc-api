import * as Joi from "joi";
import {
  MEASUREMENT_UNIT,
  PROJECT_STATUS,
} from "../../constant/common.constant";
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
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
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
        .valid(MEASUREMENT_UNIT.METRIC, MEASUREMENT_UNIT.IMPERIAL)
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
      status: Joi.number()
        .valid(
          PROJECT_STATUS.ARCHIVE,
          PROJECT_STATUS.LIVE,
          PROJECT_STATUS.ON_HOLD
        )
        .required()
        .error(commonFailValidatedMessageFunction("Status is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project is required")),
    },
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
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
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
        .valid(MEASUREMENT_UNIT.METRIC, MEASUREMENT_UNIT.IMPERIAL)
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
      status: Joi.number()
        .valid(
          PROJECT_STATUS.ARCHIVE,
          PROJECT_STATUS.LIVE,
          PROJECT_STATUS.ON_HOLD
        )
        .required()
        .error(commonFailValidatedMessageFunction("Status is required")),
    },
  },
};
