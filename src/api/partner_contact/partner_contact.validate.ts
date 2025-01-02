import { UserStatus } from "@/types";
import {
  getListValidation,
  getOneValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

const createdPartnerContactPayload = {
  firstname: requireStringValidation("First name"),
  lastname: requireStringValidation("Last name"),
  gender: Joi.boolean().required(),
  linkedin: Joi.any(),
  relation_id: requireStringValidation("Company"),
  position: requireStringValidation("Position"),
  email: requireStringValidation("Email"),
  phone: requireStringValidation("Phone"),
  mobile: requireStringValidation("Mobile"),
  remark: Joi.any(),
};

const updatedPartnerContactPayload = {
  id: requireStringValidation("Id"),
  firstname: requireStringValidation("First name"),
  lastname: requireStringValidation("Last name"),
  gender: Joi.boolean().required(),
  linkedin: Joi.any(),
  relation_id: requireStringValidation("Company"),
  position: requireStringValidation("Position"),
  email: requireStringValidation("Email"),
  phone: requireStringValidation("Phone"),
  mobile: requireStringValidation("Mobile"),
  remark: Joi.any(),
  status: Joi.number().valid(
    UserStatus.Active,
    UserStatus.Pending,
    UserStatus.Uninitiate
  ),
};

export default {
  getList: getListValidation({
    query: {
      sort: Joi.string().valid("fullname", "company_name", "country_name"),
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
    payload: Joi.object(createdPartnerContactPayload).unknown(false),
  },
  update: {
    ...getOneValidation,
    payload: Joi.object(updatedPartnerContactPayload).unknown(false),
  },
};
