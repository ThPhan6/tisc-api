import Joi from "joi";
import {
  getListValidation,
  requireBooleanValidation,
  requireEmailValidation,
  requireStringValidation,
  stringValidation,
} from "@/validates/common.validate";
import { BrandRoles, DesignFirmRoles, RoleIndex, TiscRoles } from "@/constants";
import { UserType } from "@/types";

const userPayload = {
  firstname: requireStringValidation("First name"),
  lastname: requireStringValidation("Last name"),
  gender: requireBooleanValidation("Gender"),
  location_id: requireStringValidation("Work location"),
  department_id: requireStringValidation("Department"),
  position: requireStringValidation("Position"),
  email: requireEmailValidation("Work email"),
  phone: requireStringValidation("Phone"),
  mobile: requireStringValidation("Mobile"),
  role_id: requireStringValidation("Access level"),
};

export default {
  create: {
    payload: userPayload,
  },
  updateMe: {
    payload: {
      backup_email: Joi.string().allow(""),
      personal_mobile: Joi.string().allow(""),
      zone_code: Joi.string().allow(""),
      linkedin: Joi.string().allow(""),
      interested: Joi.array().items(Joi.number()),
      personal_phone_code: Joi.string().allow(""),
    },
  },
  updateAvatar: {
    payload: {
      avatar: Joi.any(),
    },
  },
  update: {
    params: {
      id: requireStringValidation("Id"),
    },
    payload: userPayload,
  },
  getOne: {
    params: {
      id: requireStringValidation("Id"),
    },
  },
  getTeamProfileList: getListValidation({
    custom: (value) => ({
      sort: value.sort || "firstname",
      order: value.order || "ASC",
    }),
  }),
  getWithBrandId: {
    params: {
      brand_id: requireStringValidation("Brand"),
    },
  },
  getWithDesignId: {
    params: {
      design_id: requireStringValidation("Design"),
    },
  },

  assignTeam: {
    params: {
      brand_id: requireStringValidation("Brand"),
    },
    payload: {
      user_ids: Joi.array().items(Joi.string()),
    },
  },
  getListByTypeRoleAndRelation: {
    query: {
      type: Joi.number().valid(
        UserType.TISC,
        UserType.Brand,
        UserType.Designer
      ),
      role: Joi.number().valid(
        RoleIndex[TiscRoles.Admin],
        RoleIndex[TiscRoles.Consultant],
        RoleIndex[BrandRoles.Admin],
        RoleIndex[BrandRoles.Member],
        RoleIndex[DesignFirmRoles.Admin],
        RoleIndex[DesignFirmRoles.Member]
      ),
      relation_id: stringValidation(),
    },
  },
};
