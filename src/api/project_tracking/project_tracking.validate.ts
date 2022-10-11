import { commonFailValidatedMessageFunction } from "@/validate/common.validate";
import * as Joi from "joi";

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
  getList: {
    query: Joi.object({
      page: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(commonFailValidatedMessageFunction("Page must be an integer")),
      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .error(
          commonFailValidatedMessageFunction("Page Size must be an integer")
        ),
      project_status: Joi.number()
        .allow(null)
        .error(
          commonFailValidatedMessageFunction(
            "Invalid Project status filter value"
          )
        ),
      priority: Joi.number()
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
      order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        project_status: value.project_status,
        priority: value.priority,
        sort: value.sort ? value.sort : "created_at",
        order: value.order ? value.order : "DESC",
      };
    }),
  },
};
