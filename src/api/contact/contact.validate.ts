import * as Joi from "joi";
import {
  errorMessage,
  requireEmailValidation,
  requireStringValidation,
} from "@/validates/common.validate";

export default {
  create: {
    payload: {
      name: requireStringValidation("Name"),
      email: requireEmailValidation(),
      inquiry: Joi.string()
        .trim()
        .required()
        .max(250)
        .error(errorMessage("Message is required")),
    },
  },
  getById: { params: { id: requireStringValidation("Contact id") } },
};
