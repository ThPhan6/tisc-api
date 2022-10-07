import { commonFailValidatedMessageFunction } from "@/validate/common.validate";
import Joi from "joi";

export default {
  create: {
    payload: {
      product_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),

      title: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),

      message: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Message is required")),

      inquiry_for_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(commonFailValidatedMessageFunction("Inquiry for is required")),
    },
  },
};
