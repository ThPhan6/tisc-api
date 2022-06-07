import * as Joi from "joi";
export default {
  create: {
    payload: {
      name: Joi.string().required().messages({
        "string.empty": "Name can not be empty",
        "any.required": "Name can not be empty",
      }),
    },
  },
};
