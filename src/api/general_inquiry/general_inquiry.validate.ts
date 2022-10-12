import { GENERAL_INQUIRY_STATUS } from "@/constants/general_inquiry.constant";
import { commonFailValidatedMessageFunction } from "@/validate/common.validate";
import Joi from "joi";

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
  create: {
    payload: {
      product_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),

      title: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),

      message: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Message is required")),

      inquiry_for_ids: Joi.array().items(
        Joi.string()
          .trim()
          .required()
          .error(commonFailValidatedMessageFunction("Inquiry for is required"))
      ),
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
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(commonFailValidatedMessageFunction("Invalid filter")),
      sort: Joi.string().valid(
        //SortValidGeneralInquiry
        "created_at",
        "design_firm",
        "firm_location",
        "inquiry_for"
      ),
      order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        sort: value.sort ? [value.sort, value.order] : undefined,
      };
    }),
  } as any,

  getOne: {
    params: {
      id: Joi.string(),
    },
  },
};
