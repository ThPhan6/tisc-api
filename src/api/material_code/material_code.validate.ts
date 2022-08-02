import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Material name is required")),
      subs: Joi.array().items({
        name: Joi.string()
          .required()
          .error(
            commonFailValidatedMessageFunction("Sub material name is required")
          ),
        codes: Joi.array().items({
          code: Joi.string()
            .required()
            .error(commonFailValidatedMessageFunction("Code is required")),
          description: Joi.string(),
        }),
      }),
    },
  },
};
