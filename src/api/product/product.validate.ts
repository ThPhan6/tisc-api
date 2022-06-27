import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product name is required")),
    },
  },
};
