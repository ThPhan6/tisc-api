import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      title: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),

      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      })
        .required()
        .error(commonFailValidatedMessageFunction("Document is required")),
      type: Joi.number().allow(null),
    },
  },
  getById: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Document id is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Document id is required")),
    },
    payload: {
      title: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),
      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      })
        .required()
        .error(commonFailValidatedMessageFunction("Document is required")),
    },
  },
};
