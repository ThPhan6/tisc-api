import * as Joi from "joi";

export default {
  createBasisConverison: {
    payload: {
      name: Joi.string().required().messages({
        "string.empty": "Conversion name can not be empty",
        "any.required": "Conversion name can not be empty",
      }),
      subs: Joi.array()
        .items(
          Joi.object({
            name_1: Joi.string(),
            name_2: Joi.string(),
            forumla_1: Joi.number(),
            forumla_2: Joi.number(),
            unit_1: Joi.string(),
            unit_2: Joi.string(),
          })
        )
        .required()
        .messages({
          "string.empty": "Subs conversion can not be empty",
          "any.required": "Subs conversion can not be empty",
        }),
    },
  },
  updateBasisConverison: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      name: Joi.string().required().messages({
        "string.empty": "Conversion name can not be empty",
        "any.required": "Conversion name can not be empty",
      }),
      subs: Joi.array()
        .items(
          Joi.object({
            id: Joi.string(),
            name_1: Joi.string(),
            name_2: Joi.string(),
            forumla_1: Joi.number(),
            forumla_2: Joi.number(),
            unit_1: Joi.string(),
            unit_2: Joi.string(),
          })
        )
        .required()
        .messages({
          "string.empty": "Subs conversion can not be empty",
          "any.required": "Subs conversion can not be empty",
        }),
    },
  },
};
