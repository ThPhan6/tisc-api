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
import { ProjectTrackingCreateRequest } from "./project_tracking.types";

const getCreateProjectTrackingSchema = (
  value: ProjectTrackingCreateRequest,
  _helpers: Joi.CustomHelpers
) => {
  switch (value.type) {
    case EProjectTrackingType.BRAND:
      return Joi.object({
        project_name: Joi.string().required().messages({
          "any.required": "Project name is required",
        }),
        location_id: Joi.string().required().messages({
          "any.required": "Location is required",
        }),
        project_code: Joi.string().allow(null).allow(""),
        city_id: Joi.string().allow(null).allow(""),
        state_id: Joi.string().allow(null).allow(""),
        address: Joi.string().allow(null).allow(""),
        project_type_id: Joi.string().allow(null).allow(""),
        building_type_id: Joi.string().allow(null).allow(""),
        project_stage_id: Joi.string().allow(null).allow(""),
        date_of_tender: Joi.string().allow(null).allow(""),
        date_of_delivery: Joi.string().allow(null).allow(""),
        design_firm: Joi.string().allow(null).allow(""),
        postal_code: Joi.string().allow(null).allow(""),
        partner_id: Joi.string().allow(null).allow(""),
        note: Joi.string().allow(null).allow(""),
        priority: Joi.number()
          .allow(null)
          .valid(...getEnumValues(ProjectTrackingPriority)),
        type: Joi.number()
          .required()
          .valid(...getEnumValues(EProjectTrackingType)),
      });

    case EProjectTrackingType.PARTNER:
      return Joi.object({
        project_name: Joi.string().required(),
        location_id: Joi.string().required(),
        project_code: Joi.string().allow(null).allow(""),
        city_id: Joi.string().allow(null).allow(""),
        state_id: Joi.string().allow(null).allow(""),
        address: Joi.string().allow(null).allow(""),
        project_type_id: Joi.string().allow(null).allow(""),
        building_type_id: Joi.string().allow(null).allow(""),
        project_stage_id: Joi.string().allow(null).allow(""),
        date_of_tender: Joi.string().allow(null).allow(""),
        date_of_delivery: Joi.string().allow(null).allow(""),
        design_firm: Joi.string().allow(null).allow(""),
        postal_code: Joi.string().allow(null).allow(""),
        partner_id: Joi.string().allow(null).allow(""),
        note: Joi.string().allow(null).allow(""),
        priority: Joi.number()
          .allow(null)
          .valid(...getEnumValues(ProjectTrackingPriority)),
        type: Joi.number()
          .required()
          .valid(...getEnumValues(EProjectTrackingType)),
      }).unknown(false);

    default:
      return Joi.object({
        product_id: Joi.string(),
        project_id: Joi.string(),
        title: Joi.string(),
        message: Joi.string(),
        request_for_ids: Joi.array().items(Joi.string()),
        type: Joi.number()
          .required()
          .valid(...getEnumValues(EProjectTrackingType)),
      });
  }
};

const getUpdateProjectTrackingSchema = (
  value: ProjectTrackingCreateRequest,
  _helpers: Joi.CustomHelpers
) => {
  switch (value.type) {
    case EProjectTrackingType.BRAND:
      return Joi.object({
        project_name: Joi.string().allow(null),
        location_id: Joi.string().allow(null),
        project_code: Joi.string().allow(null).allow(""),
        city_id: Joi.string().allow(null).allow(""),
        state_id: Joi.string().allow(null).allow(""),
        address: Joi.string().allow(null).allow(""),
        project_type_id: Joi.string().allow(null).allow(""),
        building_type_id: Joi.string().allow(null).allow(""),
        project_stage_id: Joi.string().allow(null).allow(""),
        date_of_tender: Joi.string().allow(null).allow(""),
        date_of_delivery: Joi.string().allow(null).allow(""),
        design_firm: Joi.string().allow(null).allow(""),
        postal_code: Joi.string().allow(null).allow(""),
        partner_id: Joi.string().allow(null).allow(""),
        note: Joi.string().allow(null).allow(""),
        priority: Joi.number()
          .allow(null)
          .valid(...getEnumValues(ProjectTrackingPriority)),
        type: Joi.number()
          .required()
          .valid(...getEnumValues(EProjectTrackingType)),
      });

    case EProjectTrackingType.PARTNER:
      return Joi.object({
        project_name: Joi.string().allow(null),
        location_id: Joi.string().allow(null),
        project_code: Joi.string().allow(null).allow(""),
        city_id: Joi.string().allow(null).allow(""),
        state_id: Joi.string().allow(null).allow(""),
        address: Joi.string().allow(null).allow(""),
        project_type_id: Joi.string().allow(null).allow(""),
        building_type_id: Joi.string().allow(null).allow(""),
        project_stage_id: Joi.string().allow(null).allow(""),
        date_of_tender: Joi.string().allow(null).allow(""),
        date_of_delivery: Joi.string().allow(null).allow(""),
        design_firm: Joi.string().allow(null).allow(""),
        postal_code: Joi.string().allow(null).allow(""),
        partner_id: Joi.string().allow(null).allow(""),
        note: Joi.string().allow(null).allow(""),
        priority: Joi.number()
          .allow(null)
          .valid(...getEnumValues(ProjectTrackingPriority)),
        type: Joi.number()
          .required()
          .valid(...getEnumValues(EProjectTrackingType)),
      }).unknown(false);

    default:
      return Joi.object({
        priority: Joi.number()
          .allow(null)
          .valid(...getEnumValues(ProjectTrackingPriority)),
        assigned_teams: Joi.array().items(Joi.string()).allow(null),
        read_by: Joi.array().items(Joi.string()).allow(null),
      });
  }
};

export default {
  create: {
    payload: Joi.custom((value, helpers) => {
      const schema = getCreateProjectTrackingSchema(value, helpers);
      const { error } = schema.validate(value);

      if (error) {
        const firstError = error.details[0];
        return helpers.message({
          custom: firstError.message,
        });
      }

      return value;
    }),
  },

  update: {
    params: {
      id: requireStringValidation("Project tracking id"),
    },
    payload: Joi.custom((value, helpers) => {
      const schema = getUpdateProjectTrackingSchema(value, helpers);
      const { error } = schema.validate(value);

      if (error) {
        const firstError = error.details[0];
        return helpers.message({
          custom: firstError.message,
        });
      }

      return value;
    }),
  },

  getList: getListValidation({
    query: {
      type: Joi.number()
        .valid(...getEnumValues(EProjectTrackingType))
        .allow(null)
        .error(errorMessage("Invalid Project stage filter value")),
      project_stage: Joi.string().allow(null),
      project_status: Joi.number()
        .valid(...getEnumValues(ProjectStatus))
        .allow(null)
        .error(errorMessage("Invalid Project status filter value")),
      priority: Joi.number()
        .valid(...getEnumValues(ProjectTrackingPriority))
        .allow(null)
        .error(errorMessage("Invalid priority filter value")),
      sort: Joi.string().valid(
        "created_at",
        "project_code",
        "project_name",
        "project_location",
        "project_partner",
        "project_type",
        "design_firm"
      ),
    },
    custom: (value) => ({
      project_stage: value.project_stage,
      project_status: value.project_status,
      priority: value.priority,
      type: value.type,
      sort: value.sort,
    }),
  }),

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

  delete: {
    params: {
      id: requireStringValidation("Project tracking id"),
    },
  },
};
