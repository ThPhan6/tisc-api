import Joi from "joi";
import {
  requireStringValidation,
  requireEmailValidation,
  getOneValidation,
  getListValidation,
} from "@/validates/common.validate";
import { getEnumValues } from "@/helpers/common.helper";
import { CustomResouceType } from "@/api/custom_product/custom_product.type";
import { customProductContactValidate } from "../custom_product/custom_product.validate";

export const customResourceValidate = Joi.object({
  type: Joi.number().valid(...getEnumValues(CustomResouceType)),
  business_name: Joi.when("type", {
    is: CustomResouceType.Brand,
    then: requireStringValidation("Brand company name").empty(),
    otherwise: requireStringValidation("Distributor company name"),
  }),
  website_uri: requireStringValidation("Website").uri(),
  associate_resource_ids: Joi.array().items(Joi.string().trim()).allow(null),
  country_id: requireStringValidation("Country"),
  state_id: Joi.string().trim().allow(""),
  city_id: Joi.string().trim().allow(""),
  address: requireStringValidation("Address"),
  postal_code: requireStringValidation("Postal code"),
  general_phone: requireStringValidation("General phone"),
  general_email: requireEmailValidation("General email"),
  contacts: customProductContactValidate,
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
  getDistributorsByCompany: {
    params: {
      brand_id: requireStringValidation("Brand id"),
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
};
