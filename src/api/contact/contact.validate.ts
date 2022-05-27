import * as Joi from "@hapi/joi";

export default {
  create: {
    payload: {
      name: Joi.string().required().messages({
        "string.empty": "First name can not be empty",
        "any.required": "First name can not be empty",
      }),
      email: Joi.string().email().required().messages({
        "string.empty": "Email can not be empty",
        "any.required": "Email can not be empty",
      }),
      inquity: Joi.string().max(250).messages({
        "string.max": "Full name can not greater than 250 characters",
      }),
    },
  },
};
