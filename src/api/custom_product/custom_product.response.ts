import { paginationResponse } from "@/helper/response.helper";
import { getSummaryResponseValidate } from "@/validate/common.response";
import Joi from "joi";
import { locationBasicResponse } from "../location/location.response";
import { customProductContactValidate } from "./custom_product.validate";

export const customResourceResponse = Joi.object({
  website_uri: Joi.string(),
  design_id: Joi.string(),
  associate_resource_ids: Joi.array().items(Joi.string()),
  contacts: customProductContactValidate,
  type: Joi.number(),
  ...locationBasicResponse,
});

export default {
  getList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      pagination: paginationResponse,
      resources: Joi.array().items({
        id: Joi.string(),
        business_name: Joi.string(),
        general_email: Joi.string(),
        general_phone: Joi.string(),
        phone_code: Joi.string(),
        location: Joi.string(),
        contacts: Joi.number(),
        distributors: Joi.number(),
        cards: Joi.number(),
        brands: Joi.number(),
      }),
    }),
  }),
  getSummary: getSummaryResponseValidate(),
  getOne: Joi.object({
    data: customResourceResponse,
    statusCode: Joi.number(),
  }),
};
