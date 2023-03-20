import Joi from "joi";
import { requireStringValidation } from "@/validates/common.validate";

export default {
  retrieve: {
    payload: {
      personal_email: requireStringValidation("Personal Email"),
      mobile: requireStringValidation("Mobile Number"),
      phone_code: requireStringValidation("Mobile Country Code"),
    },
  },
  getProductList: {
    query: {
      brand_id: Joi.string(),
      category_id: Joi.string(),
      order: Joi.string().valid("ASC", "DESC"),
    },
  },
};
