import Joi from "joi";
export default {
  create: {
    payload: {
      product_id: Joi.string()
        .required()
        .error(() => new Error("Product id is required")),

      title: Joi.string()
        .required()
        .error(() => new Error("Product title is required")),

      content: Joi.string()
        .required()
        .error(() => new Error("Product content is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Product id is required")),
    },
    payload: {
      product_id: Joi.string(),
      title: Joi.string(),
      content: Joi.string(),
    },
  },
};
