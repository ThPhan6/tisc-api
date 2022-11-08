import Joi from "joi";
import {
  errorMessage,
  requireStringValidation,
} from "@/validate/common.validate";


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

export const customLibraryPayloadValidate = {
  name: requireStringValidation('Product name'),
  description: requireStringValidation('Product description'),
  images: Joi.array().items(Joi.string().trim()),
  attribute: Joi.array().items(customLibraryBasicAttributeValidate),
  specification: Joi.array().items(customLibraryBasicAttributeValidate),
  options: Joi.array().items(customLibraryOptionValidate),
  collection_id: requireStringValidation('Collection'),
  // brand_location: Joi.object({
  //   id: Joi.
  // }),
  // distributor_location_id: requireStringValidation('Distributor Address'),
  // attribute: Joi.array().items(customLibraryBasicAttributeValidate),
  // brand_contacts: CustomLibraryContact[];
  // distributor_location_id: string; /// locations
  // distributor_contacts: CustomLibraryContact[];
};

export default {
  create: {
    payload: customLibraryPayloadValidate,
  },
  update: {
    params: {
      id: requireStringValidation("Id"),
    },
    payload: customLibraryPayloadValidate,
  },
  getList: {
    query: Joi.object({
      brand_id: requireStringValidation("Brand id"),
      category_id: Joi.string(),
      collection_id: Joi.string(),
    }),
  } as any,

};
