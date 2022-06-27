import Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
      file_name: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("File name is required")),
      url: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Url is required")),
    },
  },
  update: {
    params: {
      id: Joi.string().required(),
    },
    payload: {
      product_id: Joi.string(),
      file_name: Joi.string(),
      url: Joi.string(),
    },
  },
};
