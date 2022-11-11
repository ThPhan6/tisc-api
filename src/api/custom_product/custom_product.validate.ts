import Joi from "joi";
import {
  requireStringValidation,
  requireEmailValidation,
  getOneValidation,
  getListValidation,
} from "@/validate/common.validate";
import { getEnumValues } from "@/helper/common.helper";
import { CustomResouceType } from "@/api/custom_product/custom_product.type";

export const customProductBasicAttributeValidate = Joi.object({
  name: Joi.string().trim(),
  content: Joi.string().trim(),
});

export const customProductContactValidate = Joi.array().items(
  Joi.object({
    first_name: Joi.string().trim(),
    last_name: Joi.string().trim(),
    position: Joi.string().trim(),
    work_email: Joi.string().trim(),
    work_phone: Joi.string().trim(),
    work_mobile: Joi.string().trim(),
  })
);

export const customProductOptionValidate = Joi.object({
  title: Joi.string().trim(),
  use_image: Joi.boolean(),
  tag: Joi.string().trim(),
  items: Joi.array().items(
    Joi.object({
      image: Joi.string().allow(null),
      description: Joi.string().trim(),
      product_id: Joi.string().trim(),
    })
  ),
});

export const customProductValidate = Joi.object({
  name: requireStringValidation("Product name"),
  description: requireStringValidation("Product description"),
  images: Joi.array().items(Joi.string().trim()),
  attribute: Joi.array().items(customProductBasicAttributeValidate),
  specification: Joi.array().items(customProductBasicAttributeValidate),
  options: Joi.array().items(customProductOptionValidate),
  collection_id: requireStringValidation("Collection"),
  company_id: requireStringValidation("Brand Company"),
});

export const customResourceValidate = Joi.object({
  business_name: requireStringValidation("Resource name"),
  website_uri: requireStringValidation("Website"),
  associate_resource_ids: Joi.array().items(Joi.string().trim()).allow(null),
  country_id: requireStringValidation("Country"),
  state_id: Joi.string().trim().allow(""),
  city_id: Joi.string().trim().allow(""),
  address: requireStringValidation("Address"),
  postal_code: requireStringValidation("Postal code"),
  general_phone: requireStringValidation("General phone"),
  general_email: requireEmailValidation("General email"),
  contacts: customProductContactValidate,
  type: Joi.number().valid(...getEnumValues(CustomResouceType)),
});

export const resourceTypevalidate = Joi.number()
  .valid(...getEnumValues(CustomResouceType))
  .required();

export default {
  createResource: {
    payload: customResourceValidate,
  },
  getAllResource: {
    query: {
      type: resourceTypevalidate,
    },
  },
  getListResource: getListValidation({
    query: {
      type: resourceTypevalidate,
      sort: Joi.string().valid("business_name", "location"), // GetCustomResourceListSorting
    },
  }),
  updateResource: {
    ...getOneValidation,
    payload: customResourceValidate,
  },

  createProduct: {
    payload: customProductValidate,
  },
  updateProduct: {
    ...getOneValidation,
    payload: customProductValidate,
  },
  getListProduct: {
    query: {
      company_id: Joi.string().trim().allow(""),
      collection_id: Joi.string().trim().allow(""),
    },
  },
};
