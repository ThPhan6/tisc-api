import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      author: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Author is required")),
      identity: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Identity is required")),
      quotation: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Quotation is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Quotation id is required")),
    },
    payload: {
      author: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Author is required")),
      identity: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Identity is required")),
      quotation: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Quotation is required")),
    },
  },
};
