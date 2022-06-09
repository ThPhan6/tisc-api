import * as Joi from "joi";
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
      name: Joi.string().required().messages({
        "string.empty": "Main category can not be empty",
        "any.required": "Main category can not be empty",
      }),
      subs: Joi.array()
        .items(
          Joi.object({
            name: Joi.string(),
            subs: Joi.array()
              .items({ name: Joi.string() })
              .required()
              .messages({
                "string.empty": "Category can not be empty",
                "any.required": "Category can not be empty",
              }),
          })
        )
        .required()
        .messages({
          "string.empty": "Subs category can not be empty",
          "any.required": "Subs category can not be empty",
        }),
    },
  },
  update: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      name: Joi.string().required().messages({
        "string.empty": "Main category can not be empty",
        "any.required": "Main category can not be empty",
      }),
      subs: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().allow(null),
            name: Joi.string(),
            subs: Joi.array()
              .items({
                id: Joi.string().allow(null),
                name: Joi.string(),
              })
              .required()
              .messages({
                "string.empty": "Category can not be empty",
                "any.required": "Category can not be empty",
              }),
          })
        )
        .required()
        .messages({
          "string.empty": "Sub category can not be empty",
          "any.required": "Sub category can not be empty",
        }),
    },
  },
  getListWithMultipleSort: {
    query: Joi.object({
      page: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .messages({
          "any.invalid": "Page must be an integer",
        }),
      pageSize: Joi.number()
        .min(1)
        .custom((value, helpers) => {
          if (!Number.isInteger(value)) return helpers.error("any.invalid");
          return value;
        })
        .messages({
          "any.invalid": "Page Size must be an integer",
        }),
      filter: Joi.string()
        .custom((value, helpers) => {
          return customFilter(value, helpers);
        }, "custom filter validation")
        .messages({
          "any.invalid": "Invalid filter",
        }),
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
          : undefined,
        category_order: value.category_order ? value.category_order : undefined,
      };
    }),
  } as any,
};
