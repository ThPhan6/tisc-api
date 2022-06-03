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
};
