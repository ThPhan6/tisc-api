import * as Joi from "joi";

export default {
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
      sort: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
      filter: Joi.string()
        .custom((value, helpers) => {
          try {
            const filter = JSON.parse(decodeURIComponent(value));
            if (typeof filter === "object") {
              return filter;
            }
            return helpers.error("any.invalid");
          } catch (error) {
            return helpers.error("any.invalid");
          }
        }, "custom filter validation")
        .messages({
          "any.invalid": "Invalid filter",
        }),
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
  getMany: {
    query: {
      filter: Joi.string()
        .custom((value, helpers) => {
          try {
            const filter = JSON.parse(decodeURIComponent(value));
            if (
              typeof filter === "object" &&
              filter.ids &&
              Array.isArray(filter.ids) &&
              filter.ids[0]
            ) {
              return filter;
            }
            return helpers.error("any.invalid");
          } catch (error) {
            return helpers.error("any.invalid");
          }
        }, "custom filter validation")
        .messages({
          "any.invalid": "Invalid filter",
        }),
    },
  },
  getAll: {
    query: Joi.object({
      sort: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
      filter: Joi.string()
        .custom((value, helpers) => {
          try {
            const filter = JSON.parse(decodeURIComponent(value));
            if (typeof filter === "object") {
              return filter;
            }
            return helpers.error("any.invalid");
          } catch (error) {
            return helpers.error("any.invalid");
          }
        }, "custom filter validation")
        .messages({
          "any.invalid": "Invalid filter",
        }),
    }).custom((value) => {
      return {
        filter: value.filter,
        sort: value.sort ? [value.sort, value.order] : undefined,
      };
    }),
  } as any,
};
