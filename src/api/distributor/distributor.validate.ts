import Joi from "joi";
import {
  commonFailValidatedMessageFunction,
  getListValidation,
} from "../../validate/common.validate";

export default {
  create: {
    payload: {
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Distributor Name is required")
        ),
      country_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
      address: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Address is required")),
      postal_code: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Postal code is required")),
      first_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      last_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      gender: Joi.boolean()
        .required()
        .valid(true, false)
        .error(commonFailValidatedMessageFunction("Gender is required")),
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Work email is required")),
      phone: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work phone is required")),
      mobile: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work mobile is required")),
      authorized_country_ids: Joi.array()
        .items(Joi.string().trim().required())
        .required()
        .error(
          commonFailValidatedMessageFunction("Authorized country is required")
        ),
      coverage_beyond: Joi.boolean()
        .required()
        .valid(true, false)
        .error(
          commonFailValidatedMessageFunction("Coverage beyond is required")
        ),
    },
  },

  update: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id can not be empty")),
    },
    payload: {
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
      name: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Distributor Name is required")
        ),
      country_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Country is required")),
      state_id: Joi.string().trim().allow(""),
      city_id: Joi.string().trim().allow(""),
      address: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Address is required")),
      postal_code: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Postal code is required")),
      first_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      last_name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      gender: Joi.boolean()
        .required()
        .valid(true, false)
        .error(commonFailValidatedMessageFunction("Gender is required")),
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Work email is required")),
      phone: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work phone is required")),
      mobile: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work mobile is required")),
      authorized_country_ids: Joi.array()
        .items(Joi.string().trim().required())
        .required()
        .error(
          commonFailValidatedMessageFunction("Authorized country is required")
        ),
      coverage_beyond: Joi.boolean()
        .required()
        .valid(true, false)
        .error(
          commonFailValidatedMessageFunction("Coverage beyond is required")
        ),
    },
  },
  getList: getListValidation({
    query: {
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand id is required")),
    },
    custom: (value) => ({ brand_id: value.brand_id }),
  }),
  getWithBrandId: {
    query: {
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand is required")),
    },
  },
  getMarketDistributorGroupByCountry: {
    params: {
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
  },
};
