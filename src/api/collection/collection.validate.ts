import * as Joi from "joi";
import { getMessage } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      name: Joi.string()
        .required()
        .error(getMessage("Collection name is required")),
    },
  },
};
