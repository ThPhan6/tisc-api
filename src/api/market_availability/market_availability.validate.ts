import * as Joi from "joi";
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
  create: {
    payload: {
      collection_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Collection is required")),
      country_ids: Joi.array()
        .items(
          Joi.string()
            .trim()
            .required()
            .error(commonFailValidatedMessageFunction("Country is required"))
        )
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Collection is required")),
    },
    payload: {
      country_ids: Joi.array()
        .items(
          Joi.string()
            .required()
            .error(commonFailValidatedMessageFunction("Country is required"))
        )
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
    },
  },
  getList: {
    query: Joi.object({
      brand_id: Joi.string()
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
      sort: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .error(commonFailValidatedMessageFunction("Invalid filter")),
    }).custom((value) => {
      return {
        brand_id: value.brand_id,
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        sort: !value.sort
          ? undefined
          : value.sort === "collection_name"
          ? ["name", value.order]
          : [value.sort, value.order],
      };
    }),
  } as any,
};
