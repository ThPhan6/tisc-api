import { getEnumValues } from "@/helpers/common.helper";
import {
  EProjectTrackingType,
  ProjectStatus,
  ProjectTrackingPriority,
  ProjectTrackingStage,
} from "@/types";
import {
  errorMessage,
  getListValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import * as Joi from "joi";

export default {
  create: {
    payload: {
      type: Joi.number()
        .required()
        .valid(...getEnumValues(EProjectTrackingType)),
      priority: Joi.number().valid(...getEnumValues(ProjectTrackingPriority)),

      /// designer
      product_id: Joi.string(),
      project_id: Joi.string(),
      title: Joi.string(),
      message: Joi.string(),
      request_for_ids: Joi.array().items(Joi.string()),

      /// brand
      project_name: Joi.string(),
      location_id: Joi.string(),
      project_code: Joi.string().allow(null).allow(""),
      city_id: Joi.string().allow(null).allow(""),
      state_id: Joi.string().allow(null).allow(""),
      address: Joi.string().allow(null).allow(""),
      project_type: Joi.string().allow(null).allow(""),
      building_type: Joi.string().allow(null).allow(""),
      date_of_tender: Joi.string().allow(null).allow(""),
      date_of_delivery: Joi.string().allow(null).allow(""),
      design_firm: Joi.string().allow(null).allow(""),
      partner_id: Joi.string().allow(null).allow(""),
      note: Joi.string().allow(null).allow(""),
      project_stage_id: Joi.string().allow(null).allow(""),

      /// partner
    },
  },
  getList: getListValidation({
    query: {
      type: Joi.number()
        .valid(...getEnumValues(EProjectTrackingType))
        .allow(null)
        .error(errorMessage("Invalid Project stage filter value")),
      project_stage: Joi.number()
        .valid(...getEnumValues(ProjectTrackingStage))
        .allow(null)
        .error(errorMessage("Invalid Project stage filter value")),
      project_status: Joi.number()
        .valid(...getEnumValues(ProjectStatus))
        .allow(null)
        .error(errorMessage("Invalid Project status filter value")),
      priority: Joi.number()
        .valid(...getEnumValues(ProjectTrackingPriority))
        .allow(null)
        .error(errorMessage("Invalid priority filter value")),
      sort: Joi.string().valid(
        //GetProjectListSort
        "created_at",
        "project_name",
        "project_location",
        "project_type",
        "design_firm"
      ),
    },
    custom: (value) => ({
      project_stage: value.project_stage,
      project_status: value.project_status,
      priority: value.priority,
      type: value.type,
    }),
  }),
  updateProjectTracking: {
    params: {
      id: requireStringValidation("Project tracking id"),
    },
    payload: {
      priority: Joi.number()
        .allow(null)
        .valid(...getEnumValues(ProjectTrackingPriority)),
      assigned_teams: Joi.array().items(Joi.string()).allow(null),
      read_by: Joi.array().items(Joi.string()).allow(null),
    },
  },
  get: {
    params: Joi.object({
      id: requireStringValidation("Project tracking id"),
      type: Joi.number()
        .valid(...getEnumValues(EProjectTrackingType))
        .messages({
          "any.only": "Invalid type value",
        }),
    }),
  },
};
