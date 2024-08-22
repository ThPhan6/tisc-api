import {
  errorMessage,
  getListValidation,
  requireNumberValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

const partnerCompanyValidate = {
  name: requireStringValidation("Company name"),
  website: Joi.string().trim().allow(),
  country_id: requireStringValidation("Country"),
  state_id: requireStringValidation("State"),
  city_id: requireStringValidation("City"),
  address: Joi.string().allow(),
  postal_code: Joi.string().allow(),
  phone: Joi.string().allow(),
  email: Joi.string().allow(),
  affiliation_id: Joi.string(),
  affiliation_name: Joi.string(),
  relation_id: Joi.string(),
  relation_name: Joi.string(),
  acquisition_id: Joi.string(),
  acquisition_name: Joi.string(),
  price_rate: requireNumberValidation("Price Rate"),
  authorized_country_ids: Joi.array()
    .items(Joi.string().trim().required())
    .required()
    .error(errorMessage("Authorized country is required")),
  coverage_beyond: Joi.boolean()
    .required()
    .valid(true, false)
    .error(errorMessage("Coverage beyond is required")),
  remark: Joi.string().trim().allow(),
};

export default {
  create: {
    payload: partnerCompanyValidate,
  },
  getList: getListValidation({
    query: {
      sort: Joi.string().valid("name", "country_name", "city_name"),
      order: Joi.string().valid("DESC", "ASC"),
      page: Joi.string(),
      pageSize: Joi.string(),
      filter: Joi.any(),
    },
    custom: (value) => ({
      sort: value.sort || "name",
      order: value.order || "ASC",
      filter: JSON.parse(value.filter || "{}"),
    }),
  }),
};
