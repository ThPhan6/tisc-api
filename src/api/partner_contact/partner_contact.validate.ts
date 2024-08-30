import {
  errorMessage,
  getListValidation,
  requireNumberValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

export default {
  getList: getListValidation({
    query: {
      sort: Joi.string().valid("fullname", "company", "country"),
      order: Joi.string().valid("DESC", "ASC"),
      page: Joi.string(),
      pageSize: Joi.string(),
      filter: Joi.any(),
    },
    custom: (value) => ({
      sort: value.sort || "fullname",
      order: value.order || "ASC",
      filter: JSON.parse(value.filter || "{}"),
    }),
  }),
  create: {
    payload: {
      firstname: requireStringValidation('First name'),
      lastname: requireStringValidation('Last name'),
      gender: Joi.boolean(),
      linkedin: Joi.string(),
      partner_company_id: requireStringValidation('Company'),
      position: requireStringValidation('Position'),
      email: requireStringValidation('Email'),
      phone: requireStringValidation('Phone'),
      mobile: requireStringValidation('Mobile'),
      remark: Joi.string(),
    }
  }
};
