import * as Joi from "joi";
import {
  commonFailValidatedMessageFunction,
  getListValidation,
} from "../../validate/common.validate";

export default {
  create: {
    payload: {
      collection_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Collection is required")),
      country_ids: Joi.array()
        .items(
          Joi.string()
            .trim()
            .required()
            .error(commonFailValidatedMessageFunction("Country is required"))
        )
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Collection is required")),
    },
    payload: {
      country_ids: Joi.array()
        .items(
          Joi.string()
            .required()
            .error(commonFailValidatedMessageFunction("Country is required"))
        )
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
    },
  },
  getList: getListValidation({
    query: {
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
    },
    custom: (value) => ({ brand_id: value.brand_id }),
  }),
  getWithBrandId: {
    params: {
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Collection is required")),
    },
  },
};
