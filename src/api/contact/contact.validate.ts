import * as Joi from "joi";

export default {
  create: {
    payload: {
      name: Joi.string().required().messages({
        "string.empty": "Name can not be empty",
        "any.required": "Name can not be empty",
      }),
      email: Joi.string().email().required().messages({
        "string.empty": "Email can not be empty",
        "any.required": "Email can not be empty",
      }),
      inquiry: Joi.string().max(250).messages({
        "string.max": "inquiry can not greater than 250 characters",
      }),
    },
  },
  getById: {
    params: {
      id: Joi.string().required(),
    },
  },
};
