import * as Joi from "joi";
export default {
  create: {
    payload: {
      title: Joi.string()
        .required()
        .error(() => new Error("Title is required")),
      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      })
        .required()
        .error(() => new Error("Document is required")),
      type: Joi.number().allow(null),
    },
  },
  getById: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Document id is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Document id is required")),
    },
    payload: {
      title: Joi.string()
        .required()
        .error(() => new Error("Title is required")),
      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      })
        .required()
        .error(() => new Error("Document is required")),
    },
  },
};
