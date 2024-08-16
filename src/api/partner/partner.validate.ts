import {
  errorMessage,
  requireEmailValidation,
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
  address: requireStringValidation("Address"),
  postal_code: requireStringValidation("Postal code"),
  phone: requireStringValidation("General phone"),
  email: requireEmailValidation("General email"),
  affiliation: requireStringValidation("Affiliation"),
  relation: Joi.boolean()
    .required()
    .valid(true, false)
    .error(errorMessage("Relation is required")),
  acquisition: requireNumberValidation("Acquisition"),
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
};
