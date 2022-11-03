import {
  errorMessage,
  getListValidation,
  requireEmailValidation,
  requireStringValidation,
} from "@/validate/common.validate";
import Joi from "joi";

const locationValidate = {
  business_name: requireStringValidation("Business name"),
  business_number: requireStringValidation("Business number"),
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
  getList: getListValidation(),
};
