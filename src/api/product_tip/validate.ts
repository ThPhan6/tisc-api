import Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
      contents: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          title: Joi.string()
            .required()
            .error(commonFailValidatedMessageFunction("Title is required")),
          content: Joi.string()
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
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
    payload: {
      contents: Joi.array().items(
        Joi.object({
          id: Joi.any(),
          title: Joi.string()
            .required()
            .error(commonFailValidatedMessageFunction("Title is required")),
          content: Joi.string()
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
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
  },
};
