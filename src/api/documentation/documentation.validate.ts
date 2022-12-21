import * as Joi from "joi";
import {
  errorMessage,
  getListValidation,
  requireStringValidation,
} from "@/validate/common.validate";

export default {
  create: {
    payload: {
      title: requireStringValidation("Title"),
      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      })
        .required()
        .error(errorMessage("Document is required")),
    },
  },
  getById: {
    params: {
      id: requireStringValidation("Document id"),
    },
  },
  update: {
    params: {
      id: requireStringValidation("Document id"),
    },
    payload: {
      title: requireStringValidation("Title"),
      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      })
        .required()
        .error(errorMessage("Document is required")),
    },
  },
  updateHowto: {
    payload: {
      data: Joi.array().items({
        id: requireStringValidation("Id"),
        title: requireStringValidation("Title"),
        document: Joi.object({
          document: Joi.string().trim().allow(""),
          question_and_answer: Joi.array().items({
            question: Joi.string().trim().allow(""),
            answer: Joi.string().trim().allow(""),
          }),
        })
          .required()
          .error(errorMessage("Document is required")),
      }),
    },
  },

  getList: getListValidation({
    custom: (value) => ({
      sort: value.sort || "updated_at",
    }),
  }),
};
