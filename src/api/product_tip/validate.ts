import Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      product_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Product is required")),
      contents: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          title: Joi.string()
            .trim()
            .required()
            .error(commonFailValidatedMessageFunction("Title is required")),
          content: Joi.string()
            .trim()
            .required()
            .error(commonFailValidatedMessageFunction("Content required")),
        })
      ),
    },
  },
  update: {
    params: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product is required")),
    },
    payload: {
      contents: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          title: Joi.string()
            .trim()
            .required()
            .error(commonFailValidatedMessageFunction("Title is required")),
          content: Joi.string()
            .trim()
            .required()
            .error(commonFailValidatedMessageFunction("Content required")),
        })
      ),
    },
  },
  getOne: {
    params: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product is required")),
    },
  },
};
