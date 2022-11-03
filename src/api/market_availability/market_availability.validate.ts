import * as Joi from "joi";
import {
  commonFailValidatedMessageFunction,
  getListValidation,
  requireStringValidation,
} from "@/validate/common.validate";

export default {
  create: {
    payload: {
      collection_id: requireStringValidation("Collection"),
      country_ids: Joi.array()
        .items(requireStringValidation("Country"))
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
    },
  },
  update: {
    params: {
      id: requireStringValidation("Collection"),
    },
    payload: {
      country_ids: Joi.array()
        .items(requireStringValidation("Country"))
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
    },
  },
  getList: getListValidation({
    query: {
      brand_id: requireStringValidation("Brand id"),
    },
  }),
  getWithBrandId: {
    params: {
      brand_id: requireStringValidation("Collection"),
    },
  },
};
