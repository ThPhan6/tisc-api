import Joi from "joi";
import {
  errorMessage,
  getListValidation,
  requireEmailValidation,
  requireStringValidation,
} from "@/validates/common.validate";

const locationValidate = {
  business_name: requireStringValidation("Business name"),
  business_number: Joi.string().trim().allow(""),
  functional_type_ids: Joi.array()
    .items(requireStringValidation("Functional type"))
    .required()
    .error(errorMessage("Functional type is required")),
  country_id: requireStringValidation("Country"),
  state_id: Joi.string().trim().allow(""),
  city_id: Joi.string().trim().allow(""),
  address: requireStringValidation("Address"),
  postal_code: requireStringValidation("Postal code"),
  general_phone: requireStringValidation("General phone"),
  general_email: requireEmailValidation("General email"),
};

export default {
  getMarketLocationsCountryGroup: {
    params: {
      product_id: requireStringValidation("Product id"),
    },
  },
  getBrandLocationsCountryGroup: {
    params: {
      brand_id: requireStringValidation("Brand id"),
    },
  },
  getDesignLocationsCountryGroup: {
    params: {
      design_id: requireStringValidation("Design id"),
    },
  },
  create: {
    payload: locationValidate,
  },
  update: {
    params: {
      id: requireStringValidation("Location id"),
    },
    payload: locationValidate,
  },
  getList: getListValidation({
    query: {
      is_sort_main_office_first: Joi.boolean(),
      functional_type: Joi.string().trim(),
    },
    custom: (value) => ({
      sort: value.sort || "business_name",
      order: value.order || "ASC",
    }),
  }),
};
