import Joi from "joi";
import {
  requireBooleanValidation,
  requireEmailValidation,
  requireStringValidation,
} from "@/validate/common.validate";

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
};
