import * as Joi from "joi";
export default {
  create: {
    payload: {
      title: Joi.string().required().messages({
        "string.empty": "Title can not be empty",
      }),
      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      }).required(),
      type: Joi.number().allow(null),
    },
  },
  getById: {
    params: {
      id: Joi.string().required(),
    },
  },
  update: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      title: Joi.string().required().messages({
        "string.empty": "Title can not be empty",
      }),
      document: Joi.object({
        document: Joi.string(),
        question_and_answer: Joi.array().items({
          question: Joi.string(),
          answer: Joi.string(),
        }),
      }).required(),
    },
  },
};
