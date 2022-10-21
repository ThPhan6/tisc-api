import { ActiveStatus } from "@/types";
import Joi from "joi";

import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
const customFilter = (value: any, helpers: any) => {
  try {
    const filter = JSON.parse(decodeURIComponent(value));
    if (typeof filter === "object") {
      return filter;
    }
    return helpers.error("any.invalid");
  } catch (error) {
    return helpers.error("any.invalid");
  }
};
export default {
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
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(commonFailValidatedMessageFunction("Invalid filter")),
      sort: Joi.string()
        .valid("created_at", "name", "origin", "main_office") // GetDesignFirmSort
        .allow(""),
      order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        sort: value.sort ? value.sort : "created_at",
        order: value.order ? value.order : "ASC",
      };
    }),
  } as any,

  updateDesignStatus: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Design is required")),
    },
    payload: {
      status: Joi.number()
        .valid(ActiveStatus.Active, ActiveStatus.Inactive)
        .required()
        .error(commonFailValidatedMessageFunction("Design status is required")),
    },
  },
  updateDesign: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Design is required")),
    },
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Design firm name is required")
        ),
      parent_company: Joi.string(),
      logo: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Logo is required")),
      slogan: Joi.string(),
      profile_n_philosophy: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Profile & Philosophy")),
      official_website: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Official website is required")
        ),
      capabilities: Joi.array().items(
        Joi.string()
          .trim()
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "Design capabilities is required"
            )
          )
      ),
    },
  },
};
