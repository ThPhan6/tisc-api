import Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      product_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
      contents: Joi.array()
        .items(
          Joi.object({
            id: Joi.any(),
            title: Joi.string()
              .trim()
              .required()
              .error(
                commonFailValidatedMessageFunction("Catelogue name is required")
              ),
            url: Joi.string()
              .trim()
              .required()
              .error(
                commonFailValidatedMessageFunction("Catelogue Url is required")
              ),
          })
        )
        .required()
        .error(
          commonFailValidatedMessageFunction("Catelogue contents is required")
        ),
    },
  },
  update: {
    params: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
    payload: {
      contents: Joi.array()
        .items(
          Joi.object({
            id: Joi.any(),
            title: Joi.string()
              .trim()
              .required()
              .error(
                commonFailValidatedMessageFunction("Catelogue name is required")
              ),
            url: Joi.string()
              .trim()
              .required()
              .error(
                commonFailValidatedMessageFunction("Catelogue Url is required")
              ),
          })
        )
        .required()
        .error(
          commonFailValidatedMessageFunction("Catelogue contents is required")
        ),
    },
  },
  getOne: {
    params: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
  },
};
