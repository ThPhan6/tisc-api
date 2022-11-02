import {
  commonFailValidatedMessageFunction,
  getListValidation,
} from "@/validate/common.validate";
import Joi from "joi";

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
