import Joi from "joi";
import {
  errorMessage,
  getListValidation,
  requireStringValidation,
} from "@/validate/common.validate";

export default {
  create: {
    payload: {
      brand_id: requireStringValidation("Brand id"),
      name: requireStringValidation("Distributor Name"),
      country_id: requireStringValidation("Country"),
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
      address: requireStringValidation("Address"),
      postal_code: requireStringValidation("Postal code"),
      first_name: requireStringValidation("First name"),
      last_name: requireStringValidation("Last name"),
      gender: Joi.boolean()
        .required()
        .valid(true, false)
        .error(errorMessage("Gender is required")),
      email: Joi.string()
        .email()
        .required()
        .error(errorMessage("Work email is required")),
      phone: requireStringValidation("Work phone"),
      mobile: requireStringValidation("Work mobile"),
      authorized_country_ids: Joi.array()
        .items(Joi.string().trim().required())
        .required()
        .error(errorMessage("Authorized country is required")),
      coverage_beyond: Joi.boolean()
        .required()
        .valid(true, false)
        .error(errorMessage("Coverage beyond is required")),
    },
  },

  update: {
    params: {
      id: requireStringValidation("Id"),
    },
    payload: {
      name: requireStringValidation("Distributor Name"),
      brand_id: requireStringValidation("Brand id"),
      country_id: requireStringValidation("Country"),
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
      address: requireStringValidation("Address"),
      postal_code: requireStringValidation("Postal code"),
      first_name: requireStringValidation("First name"),
      last_name: requireStringValidation("Last name"),
      gender: Joi.boolean()
        .required()
        .valid(true, false)
        .error(errorMessage("Gender is required")),
      email: Joi.string()
        .email()
        .required()
        .error(errorMessage("Work email is required")),
      phone: requireStringValidation("Work phone"),
      mobile: requireStringValidation("Work mobile"),
      authorized_country_ids: Joi.array()
        .items(Joi.string().trim().required())
        .required()
        .error(errorMessage("Authorized country is required")),
      coverage_beyond: Joi.boolean()
        .required()
        .valid(true, false)
        .error(errorMessage("Coverage beyond is required")),
    },
  },
  getList: getListValidation({
    query: { brand_id: requireStringValidation("Brand id") },
    custom: (value) => ({ brand_id: value.brand_id }),
  }),
  getWithBrandId: {
    query: { brand_id: requireStringValidation("Brand id") },
  },
  getMarketDistributorGroupByCountry: {
    params: { product_id: requireStringValidation("Product id") },
  },
};
