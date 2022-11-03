import { getEnumValues } from "@/helper/common.helper";
import { ProjectStatus } from "@/types";
import {
  commonFailValidatedMessageFunction,
  getListValidation,
} from "@/validate/common.validate";
import * as Joi from "joi";
import { ProjectTrackingPriority } from "./project_tracking.model";

const requiredProductId = Joi.string()
  .required()
  .error(commonFailValidatedMessageFunction("Product id is required"));
const requiredProjectId = Joi.string()
  .required()
  .error(commonFailValidatedMessageFunction("Project id is required"));

export default {
  createProjectRequest: {
    payload: {
      product_id: requiredProductId,
      project_id: requiredProjectId,
      title: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),
      message: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Message is required")),
      request_for_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(commonFailValidatedMessageFunction("Request for is required")),
    },
  },
  getList: getListValidation({
    query: {
      project_status: Joi.number()
        .valid(...getEnumValues(ProjectStatus))
        .allow(null)
        .error(
          commonFailValidatedMessageFunction(
            "Invalid Project status filter value"
          )
        ),
      priority: Joi.number()
        .valid(...getEnumValues(ProjectTrackingPriority))
        .allow(null)
        .error(
          commonFailValidatedMessageFunction("Invalid priority filter value")
        ),
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
      project_status: value.project_status,
      priority: value.priority,
    }),
  }),
  updateProjectTracking: {
    params: {
      id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Project tracking id is required")
        ),
    },
    payload: {
      priority: Joi.number()
        .allow(null)
        .valid(...getEnumValues(ProjectTrackingPriority)),
      assigned_teams: Joi.array().items(Joi.string()).allow(null),
      read_by: Joi.array().items(Joi.string()).allow(null),
    },
  },
  getOne: {
    params: Joi.object({
      id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Project tracking id is required")
        ),
    }),
  },
};
