import * as Joi from "joi";
import { getMessage } from "../../validate/common.validate";
export default {
  create: {
    payload: {
      firstname: Joi.string()
        .required()
        .error(getMessage("First name is required")),
      lastname: Joi.string()
        .required()
        .error(getMessage("Last name is required")),
      gender: Joi.boolean().required().error(getMessage("Gender is required")),
      location_id: Joi.string()
        .required()
        .error(getMessage("Location id is required")),
      department: Joi.string()
        .required()
        .error(getMessage("Department is required")),
      position: Joi.string()
        .required()
        .error(getMessage("Position is required")),
      email: Joi.string()
        .email()
        .required()
        .error(getMessage("Email is required")),
      phone: Joi.string().required().error(getMessage("Phone is required")),
      mobile: Joi.string().required().error(getMessage("Mobile is required")),
      role_id: Joi.string().required().error(getMessage("Role id is required")),
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
      id: Joi.string().required().error(getMessage("Id is required")),
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
      id: Joi.string().required().error(getMessage("Id is required")),
    },
  },
};
