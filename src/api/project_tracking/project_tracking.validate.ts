import { getEnumValues } from "@/helpers/common.helper";
import { ProjectStatus } from "@/types";
import {
  errorMessage,
  getListValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import * as Joi from "joi";
import { ProjectTrackingPriority } from "./project_tracking.model";

const requiredProductId = requireStringValidation("Product id");
const requiredProjectId = requireStringValidation("Project id");

export default {
  createProjectRequest: {
    payload: {
      product_id: requiredProductId,
      project_id: requiredProjectId,
      title: requireStringValidation("Title"),
      message: requireStringValidation("Message"),
      request_for_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(errorMessage("Request for is required")),
    },
  },
  getList: getListValidation({
    query: {
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
      project_status: value.project_status,
      priority: value.priority,
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
  getOne: {
    params: Joi.object({
      id: requireStringValidation("Project tracking id"),
    }),
  },
};
