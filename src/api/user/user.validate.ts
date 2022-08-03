import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      firstname: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      lastname: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      gender: Joi.boolean()
        .required()
        .error(commonFailValidatedMessageFunction("Gender is required")),
      location_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work location is required")),
      department_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Department is required")),
      position: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Position is required")),
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Work email is required")),
      phone: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Phone is required")),
      mobile: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Mobile is required")),
      role_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Access level is required")),
    },
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
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id is required")),
    },
    payload: {
      firstname: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      lastname: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      gender: Joi.boolean()
        .required()
        .error(commonFailValidatedMessageFunction("Gender is required")),
      location_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Work location is required")),
      department_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Department is required")),
      position: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Position is required")),
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Work email is required")),
      phone: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Phone is required")),
      mobile: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Mobile is required")),
      role_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Access level is required")),
    },
  },
  getOne: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Id is required")),
    },
  },
  getWithBrandId: {
    params: {
      brand_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand is required")),
    },
  },
  getWithDesignId: {
    params: {
      design_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Design is required")),
    },
  },
};
