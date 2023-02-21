import Joi from "joi";
import {
  errorMessage,
  getListValidation,
  requireEmailValidation,
  requireStringValidation,
} from "@/validates/common.validate";

const distributorValidate = {
  brand_id: requireStringValidation("Brand id"),
  name: requireStringValidation("Distributor name"),
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
  email: requireEmailValidation("Work email"),
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
};

export default {
  create: {
    payload: distributorValidate,
  },

  update: {
    params: {
      id: requireStringValidation("Id"),
    },
    payload: distributorValidate,
  },
  getList: getListValidation({
    query: {
      brand_id: requireStringValidation("Brand id"),
      sort: Joi.string().valid("name", "country_name", "city_name"), //GetListDistributorSort
    },
  }),
  getWithBrandId: {
    query: { brand_id: requireStringValidation("Brand id") },
  },
  getMarketDistributorGroupByCountry: {
    params: { product_id: requireStringValidation("Product id") },
    query: {
      project_id: Joi.string(),
    },
  },
};
