import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      firstname: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      lastname: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Last name is required")),
      gender: Joi.boolean()
        .required()
        .error(commonFailValidatedMessageFunction("Gender is required")),
      location_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Location id is required")),
      department: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Department is required")),
      position: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Position is required")),
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Email is required")),
      phone: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Phone is required")),
      mobile: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Mobile is required")),
      role_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Role id is required")),
    },
  },
  updateMe: {
    payload: {
      backup_email: Joi.string().allow(""),
      personal_mobile: Joi.string().allow(""),
      zone_code: Joi.string().allow(""),
      linkedin: Joi.string().allow(""),
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
      firstname: Joi.string(),
      lastname: Joi.string(),
      gender: Joi.boolean(),
      location_id: Joi.string(),
      department: Joi.string(),
      position: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      mobile: Joi.string(),
    },
  },
  getOne: {
    params: {
      id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Id is required")),
    },
  },
};
