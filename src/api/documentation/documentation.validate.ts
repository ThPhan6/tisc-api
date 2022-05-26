import * as Joi from "@hapi/joi";
export default {
  create: {
    payload: {
      title: Joi.string().required().messages({
        "string.empty": "Title can not be empty",
      }),
      document: Joi.string().required().messages({
        "string.empty": "Document can not be empty",
      }),
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
      document: Joi.string().required().messages({
        "string.empty": "Document can not be empty",
      }),
    },
  },
};
