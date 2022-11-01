import {
  commonFailValidatedMessageFunction,
  getListValidation,
} from "@/validate/common.validate";
import Joi from "joi";

const customFilter = (value: any, helpers: any) => {
  try {
    const filter = JSON.parse(decodeURIComponent(value));
    if (typeof filter === "object") {
      return filter;
    }
    return helpers.error("any.invalid");
  } catch (error) {
    return helpers.error("any.invalid");
  }
};
export default {
  create: {
    payload: {
      product_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),

      title: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),

      message: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Message is required")),

      inquiry_for_ids: Joi.array().items(
        Joi.string()
          .trim()
          .required()
          .error(commonFailValidatedMessageFunction("Inquiry for is required"))
      ),
    },
  },
  getList: getListValidation({
    query: {
      sort: Joi.string().valid(
        //SortValidGeneralInquiry
        "created_at",
        "design_firm",
        "firm_location",
        "inquiry_for"
      ),
    },
  }),
  getOne: {
    params: {
      id: Joi.string(),
    },
  },
};
