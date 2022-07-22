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
      name: Joi.string()
        .trim()
        .required()
        .error(() => new Error("Main category is required")),
      subs: Joi.array()
        .items(
          Joi.object({
            name: Joi.string()
              .trim()
              .required()
              .error(() => new Error("Subs category is required")),
            subs: Joi.array()
              .items({
                name: Joi.string()
                  .trim()
                  .required()
                  .error(() => new Error("Category is required")),
              })
              .required()
              .error(() => new Error("Category is required")),
          })
        )
        .required()
        .error(() => new Error("Subs category is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Category id is required")),
    },
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(() => new Error("Main category is required")),
      subs: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().allow(null),
            name: Joi.string()
              .trim()
              .required()
              .error(() => new Error("Subs category is required")),
            subs: Joi.array()
              .items({
                id: Joi.string().allow(null),
                name: Joi.string()
                  .trim()
                  .required()
                  .error(() => new Error("Category is required")),
              })
              .required()
              .error(() => new Error("Category is required")),
          })
        )
        .required()
        .error(() => new Error("Subs category is required")),
    },
  },
  getListCategory: {
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
      main_category_order: Joi.string().valid("ASC", "DESC"),
      sub_category_order: Joi.string().valid("ASC", "DESC"),
      category_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        main_category_order: value.main_category_order
          ? value.main_category_order
          : "ASC",
        sub_category_order: value.sub_category_order
          ? value.sub_category_order
          : "ASC",
        category_order: value.category_order ? value.category_order : "ASC",
      };
    }),
  } as any,
};
