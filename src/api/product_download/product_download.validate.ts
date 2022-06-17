import Joi from "joi";
export default {
  create: {
    payload: {
      product_id: Joi.string().required().messages({
        "string.empty": "Product id can not be empty",
        "any.required": "Product id can not be empty",
      }),
      file_name: Joi.string().required().messages({
        "string.empty": "File name can not be empty",
        "any.required": "File name can not be empty",
      }),
      url: Joi.string().required().messages({
        "string.empty": "Url can not be empty",
        "any.required": "Url can not be empty",
      }),
    },
  },
  update: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      product_id: Joi.string(),
      file_name: Joi.string(),
      url: Joi.string(),
    },
  },
};
