import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Contact name is required")),

      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Contact email is required")),
      inquiry: Joi.string()
        .max(250)
        .error(
          commonFailValidatedMessageFunction(
            "inquiry can not greater than 250 characters"
          )
        ),
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
