import * as Joi from "joi";
import {
  errorMessage,
  getListValidation,
  requireStringValidation,
} from "@/validate/common.validate";

export default {
  update: {
    params: {
      id: requireStringValidation("Collection"),
    },
    payload: {
      countries: Joi.array()
        .items(Joi.object({
          id: requireStringValidation("Country"),
          available: Joi.boolean(),
        }))
        .required()
        .error(errorMessage("Country is required")),
    },
  },
  getList: getListValidation({
    query: {
      brand_id: requireStringValidation("Brand id"),
    },
  }),
  getWithBrandId: {
    params: {
      brand_id: requireStringValidation("Brand id"),
    },
  },
};
