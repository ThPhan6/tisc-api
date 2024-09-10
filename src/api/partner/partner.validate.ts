import {
  errorMessage,
  getListValidation,
  requireNumberValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

const partnerCompanyValidate = {
  name: requireStringValidation("Company name"),
  website: Joi.any(),
  country_id: requireStringValidation("Country"),
  state_id: Joi.any(),
  city_id: Joi.any(),
  address: Joi.string().allow(),
  postal_code: Joi.string().allow(),
  phone: Joi.string().allow(),
  email: Joi.string().allow(),
  affiliation_id: Joi.any(),
  affiliation_name: Joi.any(),
  relation_id: Joi.any(),
  relation_name: Joi.any(),
  acquisition_id: Joi.any(),
  acquisition_name: Joi.any(),
  price_rate: requireNumberValidation("Price Rate"),
  authorized_country_ids: Joi.array()
    .items(Joi.string().trim().required())
    .required()
    .error(errorMessage("Authorized country is required")),
  coverage_beyond: Joi.boolean()
    .required()
    .valid(true, false)
    .error(errorMessage("Coverage beyond is required")),
  remark: Joi.any(),
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
  update: {
    params: {
      id: requireStringValidation("Id"),
    },
    payload: partnerCompanyValidate,
  },
};
