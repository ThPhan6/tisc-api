import Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      product_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Product is required")),
      contents: Joi.array()
        .items(
          Joi.object({
            id: Joi.any(),
            title: Joi.string()
              .trim()
              .required()
              .error(
                commonFailValidatedMessageFunction(
                  "File name product download is required"
                )
              ),
            url: Joi.string()
              .trim()
              .required()
              .error(
                commonFailValidatedMessageFunction(
                  "Url product download is required"
                )
              ),
          })
        )
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Product download contents is required"
          )
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
                commonFailValidatedMessageFunction(
                  "File name product download is required"
                )
              ),
            url: Joi.string()
              .trim()
              .required()
              .error(
                commonFailValidatedMessageFunction(
                  "Url product download is required"
                )
              ),
          })
        )
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Product download contents is required"
          )
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
