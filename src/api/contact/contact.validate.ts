import * as Joi from "joi";
import { getMessage } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      name: Joi.string()
        .required()
        .error(getMessage("Contact name is required")),

      email: Joi.string()
        .email()
        .required()
        .error(getMessage("Contact email is required")),
      inquiry: Joi.string()
        .max(250)
        .error(getMessage("inquiry can not greater than 250 characters")),
    },
  },
  getById: {
    params: {
      id: Joi.string().required().error(getMessage("Contact id is required")),
    },
  },
};
