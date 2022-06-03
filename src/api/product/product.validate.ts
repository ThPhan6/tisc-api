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
            subs: Joi.array().items({ name: Joi.string() }).allow(null),
          })
        )
        .allow(null),
    },
  },
  getById: {
    params: {
      id: Joi.string().required(),
    },
  },
  update: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      id: Joi.string().required().messages({
        "string.empty": "ID can not be empty",
        "any.required": "ID can not be empty",
      }),
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
              .allow(null),
          })
        )
        .allow(null),
    },
  },
};
