import { getEnumValues } from "@/helper/common.helper";
import { ProjectStatus } from "@/types";
import * as Joi from "joi";
import { MEASUREMENT_UNIT } from "@/constant/common.constant";
import {
  errorMessage,
  requireStringValidation,
} from "@/validate/common.validate";

export default {
  create: {
    payload: {
      code: requireStringValidation("Project code"),
      name: requireStringValidation("Project name"),
      country_id: requireStringValidation("Country"),
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
      address: requireStringValidation("Address"),
      postal_code: requireStringValidation("Postal code"),
      project_type_id: requireStringValidation("Project type"),
      building_type_id: requireStringValidation("Building type"),
      measurement_unit: Joi.number()
        .valid(MEASUREMENT_UNIT.METRIC, MEASUREMENT_UNIT.IMPERIAL)
        .required()
        .error(errorMessage("Measurement unit is required")),
      design_due: requireStringValidation("Design due"),
      construction_start: requireStringValidation("Construction start"),
      status: Joi.number()
        .valid(...getEnumValues(ProjectStatus))
        .required()
        .error(errorMessage("Status is required")),
    },
  },
  update: {
    params: {
      id: requireStringValidation("Project"),
    },
    payload: {
      code: requireStringValidation("Project code"),
      name: requireStringValidation("Project name"),
      country_id: requireStringValidation("Country"),
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
      address: requireStringValidation("Address"),
      postal_code: requireStringValidation("Postal code"),
      project_type_id: requireStringValidation("Project type"),
      building_type_id: requireStringValidation("Building type"),
      measurement_unit: Joi.number()
        .valid(MEASUREMENT_UNIT.METRIC, MEASUREMENT_UNIT.IMPERIAL)
        .required()
        .error(errorMessage("Measurement unit is required")),
      design_due: requireStringValidation("Design due"),
      construction_start: requireStringValidation("Construction start"),
      status: Joi.number()
        .valid(...getEnumValues(ProjectStatus))
        .required()
        .error(errorMessage("Status is required")),
      team_profile_ids: Joi.array().items(Joi.string()).allow(null),
    },
  },
  getWithDesignId: {
    query: {
      design_id: requireStringValidation("Design id"),
    },
  },
  assignTeamProject: {
    params: {
      id: requireStringValidation("Project id"),
    },
    payload: {
      team_profile_ids: Joi.array().items(Joi.string()).allow(null),
    },
  },
};
