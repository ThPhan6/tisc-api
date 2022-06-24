import * as Joi from "joi";

export default {
  create: {
    payload: {
      name: Joi.string()
        .required()
        .error(() => new Error("Contact name is required")),
      email: Joi.string()
        .email()
        .required()
        .error(() => new Error("Contact email is required")),
      inquiry: Joi.string()
        .max(250)
        .error(() => new Error("inquiry can not greater than 250 characters")),
    },
  },
  getById: {
    params: {
      id: Joi.string()
        .required()
        .error(() => new Error("Contact id is required")),
    },
  },
};
