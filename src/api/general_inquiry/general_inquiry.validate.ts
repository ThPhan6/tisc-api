import {
  getListValidation,
  requireStringValidation,
} from "@/validate/common.validate";
import Joi from "joi";

export default {
  create: {
    payload: {
      product_id: requireStringValidation("Product id"),
      title: requireStringValidation("Title"),
      message: requireStringValidation("Message"),
      inquiry_for_ids: Joi.array().items(
        requireStringValidation("Inquiry for")
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
  getOne: { params: { id: Joi.string() } },
};
