import * as Joi from "joi";

export default {
  getOne: {
    params: {
      id: Joi.string().required().messages({
        "string.empty": "Id can not be empty",
        "any.required": "Id can not be empty",
      }),
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
    }).custom((value) => {
      return {
        limit: !value.page || !value.pageSize ? 10 : value.pageSize,
        offset:
          !value.page || !value.pageSize
            ? 0
            : (value.page - 1) * value.pageSize,
      };
    }),
  } as any,
};
