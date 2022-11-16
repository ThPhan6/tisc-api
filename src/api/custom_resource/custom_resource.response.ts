import { paginationResponse } from "@/helper/response.helper";
import { getSummaryResponseValidate } from "@/validate/common.response";
import Joi from "joi";
import { customProductContactValidate } from "../custom_product/custom_product.validate";
import { locationBasicResponse } from "../location/location.response";

export const customResourceResponse = Joi.object({
  website_uri: Joi.string(),
  design_id: Joi.string(),
  associate_resource_ids: Joi.array().items(Joi.string()),
  contacts: customProductContactValidate,
  type: Joi.number(),
  created_at: Joi.string().allow("", null),
  updated_at: Joi.string().allow("", null),
  location_id: Joi.string().allow("", null),
  ...locationBasicResponse,
});

export default {
  getResourceList: Joi.object({
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
  getResourceSummary: getSummaryResponseValidate(),
  getOneResource: Joi.object({
    data: customResourceResponse,
    statusCode: Joi.number(),
  }),
  getAllResource: Joi.object({
    data: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
      })
    ),
    statusCode: Joi.number(),
  }),
};
