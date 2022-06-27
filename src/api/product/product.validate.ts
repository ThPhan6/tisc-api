import * as Joi from "joi";
import { getMessage } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      name: Joi.string()
        .required()
        .error(getMessage("Product name is required")),
    },
  },
};
