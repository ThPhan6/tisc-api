import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export default {
  create: {
    payload: {
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Name is required")),

      email: Joi.string()
        .email()
        .regex(regexEmail)
        .required()
        .error(commonFailValidatedMessageFunction("Email invalid")),
      inquiry: Joi.string()
        .trim()
        .required()
        .max(250)
        .error(commonFailValidatedMessageFunction("Message is missing")),
    },
  },
  getById: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Contact id is required")),
    },
  },
};
