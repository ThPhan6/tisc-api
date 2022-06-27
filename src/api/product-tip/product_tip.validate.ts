import Joi from "joi";
import { getMessage } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      product_id: Joi.string()
        .required()
        .error(getMessage("Product id is required")),

      title: Joi.string()
        .required()
        .error(getMessage("Product title is required")),
      content: Joi.string()
        .required()
        .error(getMessage("Product content is required")),
    },
  },
  update: {
    params: {
      id: Joi.string().required().error(getMessage("Product id is required")),
    },
    payload: {
      product_id: Joi.string(),
      title: Joi.string(),
      content: Joi.string(),
    },
  },
};
