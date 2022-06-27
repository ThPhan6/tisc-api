import Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),

      title: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product title is required")),
      content: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Product content is required")
        ),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
    payload: {
      product_id: Joi.string(),
      title: Joi.string(),
      content: Joi.string(),
    },
  },
};
