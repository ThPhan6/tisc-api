import * as Joi from "joi";

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
                "string.empty": "Subs category can not be empty",
                "any.required": "Subs category can not be empty",
              }),
          })
        )
        .required()
        .messages({
          "string.empty": "Category can not be empty",
          "any.required": "Category can not be empty",
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
                "string.empty": "Subs category can not be empty",
                "any.required": "Subs category can not be empty",
              }),
          })
        )
        .required()
        .messages({
          "string.empty": "Category can not be empty",
          "any.required": "Category can not be empty",
        }),
    },
  },
};
