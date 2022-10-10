import { GENERAL_INQUIRY_STATUS } from "@/constants/general_inquiry.constant";
import { commonFailValidatedMessageFunction } from "@/validate/common.validate";
import Joi from "joi";

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

      inquiry_for_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Inquiry for is required")),
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
      status: Joi.number().valid(
        GENERAL_INQUIRY_STATUS.PENDING,
        GENERAL_INQUIRY_STATUS.RESPONDED
      ),
      sort: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        status: value.status,
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
