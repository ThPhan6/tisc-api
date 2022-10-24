import { getEnumValues } from "@/helper/common.helper";
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
      sort: Joi.string(),
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
  updateBrandProfile: {
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand name is required")),
      parent_company: Joi.string().trim().allow(""),
      slogan: Joi.string().trim().allow(""),
      mission_n_vision: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Mission and vision is required")
        ),
      official_websites: Joi.array()
        .items({
          country_id: Joi.string(),
          url: Joi.string(),
        })
        .required()
        .error(
          commonFailValidatedMessageFunction("Official website is required")
        ),
    },
  } as any,
  invite: {
    payload: {
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("email is required")),
    },
  },
  create: {
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand Name is required")),
      first_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      last_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Email is required")),
    },
  },
  updateBrandStatus: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand is required")),
    },
    payload: {
      status: Joi.number()
        .valid(...getEnumValues(ActiveStatus))
        .required()
        .error(commonFailValidatedMessageFunction("Status required")),
    },
  },
};
