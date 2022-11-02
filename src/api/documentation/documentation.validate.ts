import * as Joi from "joi";
import {
  commonFailValidatedMessageFunction,
  getListValidation,
} from "../../validate/common.validate";

export default {
  create: {
    payload: {
      title: Joi.string()
        .trim()
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
        .trim()
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
  updateHowto: {
    payload: {
      data: Joi.array().items({
        id: Joi.string()
          .required()
          .error(commonFailValidatedMessageFunction("Id is required")),
        title: Joi.string()
          .trim()
          .required()
          .error(commonFailValidatedMessageFunction("Title is required")),
        document: Joi.object({
          document: Joi.string().trim().allow(""),
          question_and_answer: Joi.array().items({
            question: Joi.string().trim().allow(""),
            answer: Joi.string().trim().allow(""),
          }),
        })
          .required()
          .error(commonFailValidatedMessageFunction("Document is required")),
      }),
    },
  },

  getList: getListValidation({
    custom: (value) => ({
      sort: value.sort || "updated_at",
    }),
  }),
};
