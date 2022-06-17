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
  getStates: {
    params: {
      country_id: Joi.string().required(),
    },
  },
  create: {
    payload: {
      business_name: Joi.string().required(),
      business_number: Joi.string().required(),
      functional_type_ids: Joi.array().items(Joi.string()).required(),
      country_id: Joi.string().required(),
      state_id: Joi.string(),
      city_id: Joi.string().required(),
      address: Joi.string().required(),
      postal_code: Joi.string().required(),
      general_phone: Joi.string().required(),
      general_email: Joi.string().required(),
    },
  },
  update: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      business_name: Joi.string().required(),
      business_number: Joi.string().required(),
      functional_type_ids: Joi.array().items(Joi.string()).required(),
      country_id: Joi.string().required(),
      state_id: Joi.string(),
      city_id: Joi.string().required(),
      address: Joi.string().required(),
      postal_code: Joi.string().required(),
      general_phone: Joi.string().required(),
      general_email: Joi.string().required(),
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
      sort_name: Joi.string(),
      sort_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
        filter: value.filter,
        sort_name: value.sort_name ? value.sort_name : "created_at",
        sort_order: value.sort_order ? value.sort_order : "ASC",
      };
    }),
  } as any,
};
