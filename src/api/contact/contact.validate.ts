import * as Joi from "joi";
import {
  errorMessage,
  requireStringValidation,
} from "@/validate/common.validate";

const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default {
  create: {
    payload: {
      name: requireStringValidation("Name"),
      email: Joi.string()
        .email()
        .regex(regexEmail)
        .required()
        .error(errorMessage("Email invalid")),
      inquiry: Joi.string()
        .trim()
        .required()
        .max(250)
        .error(errorMessage("Message is required")),
    },
  },
  getById: { params: { id: requireStringValidation("Contact id") } },
};
