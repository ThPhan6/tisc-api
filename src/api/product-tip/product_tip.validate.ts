import Joi from "joi";
export default {
  create: {
    payload: {
      product_id: Joi.string().required().messages({
        "string.empty": "Product id can not be empty",
        "any.required": "Product id can not be empty",
      }),
      title: Joi.string().required().messages({
        "string.empty": "Title can not be empty",
        "any.required": "Title can not be empty",
      }),
      content: Joi.string().required().messages({
        "string.empty": "Content can not be empty",
        "any.required": "Content can not be empty",
      }),
    },
  },
  update: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      product_id: Joi.string(),
      title: Joi.string(),
      content: Joi.string(),
    },
  },

  getTipsByProductId: {
    params: {
      product_id: Joi.string().required(),
    },
  },
};
