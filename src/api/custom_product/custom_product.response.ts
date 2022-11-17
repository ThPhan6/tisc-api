import Joi from "joi";
import { locationBasicResponse } from "../location/location.response";
import { dimensionAndWeightValidate } from "../product/product.validate";
import {
  basicAttributeValidate,
  customProductOptionValidate,
  customProductValidate,
} from "./custom_product.validate";

export const customProductResponse = {
  id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  image: Joi.string(),
  attributes: Joi.array().items(basicAttributeValidate),
  specification: Joi.array().items(basicAttributeValidate),
  options: Joi.array().items(customProductOptionValidate),
  dimension_and_weight: dimensionAndWeightValidate,
  collection_id: Joi.string(),
  company_id: Joi.string(),
  created_at: Joi.string(),
  updated_at: Joi.string(),
  design_id: Joi.string(),
};

export default {
  getProductList: Joi.object({
    statusCode: Joi.number(),
    data: Joi.object({
      products: Joi.array().items({
        id: Joi.string(),
        name: Joi.string(),
        description: Joi.string(),
        company_id: Joi.string(),
        collection_id: Joi.string(),
        location: Joi.string(),
        image: Joi.string(),
        company_name: Joi.string(),
        collection_name: Joi.string(),
      }),
    }),
  }),
  getOneProduct: Joi.object({
    data: customProductValidate.keys({
      id: Joi.string(),
      collection_name: Joi.string(),
      company_name: Joi.string(),
      created_at: Joi.string(),
      updated_at: Joi.string(),
      design_id: Joi.string(),
      location: locationBasicResponse,
      dimension_and_weight: dimensionAndWeightValidate,
    }),
    statusCode: Joi.number(),
  }),
};
