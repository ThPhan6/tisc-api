import Joi from "joi";
import {
  requireStringValidation,
  requireEmailValidation,
  getOneValidation,
  getListValidation,
} from "@/validate/common.validate";
import {getEnumValues} from '@/helper/common.helper';
import {CustomLibraryCompanyType} from '@/api/custom_library/custom_library.type';


export const customLibraryBasicAttributeValidate = Joi.object({
  name: Joi.string().trim(),
  content: Joi.string().trim(),
});
export const customLibraryContactValidate = Joi.object({
  first_name: Joi.string().trim(),
  last_name: Joi.string().trim(),
  position: Joi.string().trim(),
  work_email: Joi.string().trim(),
  work_phone: Joi.string().trim(),
  work_mobile: Joi.string().trim(),
});

export const customLibraryOptionValidate = Joi.object({
  title: Joi.string().trim(),
  use_image: Joi.boolean(),
  tag: Joi.string().trim(),
  items: Joi.array().items(Joi.object({
    image: Joi.string().allow(null, undefined),
    description: Joi.string().trim(),
    product_id: Joi.string().trim(),
  }))
})

export const customLibraryPayloadValidate = Joi.object({
  name: requireStringValidation('Product name'),
  description: requireStringValidation('Product description'),
  images: Joi.array().items(Joi.string().trim()),
  attribute: Joi.array().items(customLibraryBasicAttributeValidate),
  specification: Joi.array().items(customLibraryBasicAttributeValidate),
  options: Joi.array().items(customLibraryOptionValidate),
  collection_id: requireStringValidation('Collection'),
  custom_library_company_id: requireStringValidation('Brand Company'),
});

export const customLibraryCompanyValidate = Joi.object({
  name: requireStringValidation('Company name'),
  website_uri: requireStringValidation('Website'),
  associate_company_ids: Joi.array().items(Joi.string().trim()).allow(null),
  country_id: requireStringValidation("Country"),
  state_id: Joi.string().trim().allow(""),
  city_id: Joi.string().trim().allow(""),
  address: requireStringValidation("Address"),
  postal_code: requireStringValidation("Postal code"),
  general_phone: requireStringValidation("General phone"),
  general_email: requireEmailValidation("General email"),
  contacts: Joi.array().items(customLibraryContactValidate),
  type: Joi.number().valid(...getEnumValues(CustomLibraryCompanyType))
});

export default {
  createProduct: {
    payload: customLibraryPayloadValidate,
  },
  updateProduct: {
    getOneValidation,
    payload: customLibraryPayloadValidate,
  },
  createCompany: {
    payload: customLibraryCompanyValidate
  },
  updateCompany: {
    getOneValidation,
    payload: customLibraryCompanyValidate
  },
  getListProduct: {
    query: {
      custom_library_company_id: Joi.string().trim().allow(''),
      collection_id: Joi.string().trim().allow(''),
    }
  },
  getListCompany: getListValidation({
    query: {
      type: Joi.number().valid(...getEnumValues(CustomLibraryCompanyType))
    }
  }),
};
