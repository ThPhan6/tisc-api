import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Collection name is required")
        ),
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand is required")),
    },
  },
  getList: {
    query: Joi.object({
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand is required")),
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
    }).custom((value) => {
      return {
        brand_id: value.brand_id,
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
      };
    }),
  } as any,
};
