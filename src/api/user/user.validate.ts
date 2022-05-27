import * as Joi from "joi";

export default {
  create: {
    payload: {
      firstname: Joi.string().required().messages({
        "string.empty": "First name can not be empty",
        "any.required": "First name can not be empty",
      }),
      lastname: Joi.string().required().messages({
        "string.empty": "Last name can not be empty",
        "any.required": "Last name can not be empty",
      }),
      gender: Joi.boolean().required(),

      location_id: Joi.string().required().messages({
        "string.empty": "Location id can not be empty",
        "any.required": "Location id can not be empty",
      }),
      department: Joi.string().required().messages({
        "string.empty": "Department can not be empty",
        "any.required": "Department can not be empty",
      }),
      position: Joi.string().required().messages({
        "string.empty": "Position can not be empty",
        "any.required": "Position can not be empty",
      }),
      email: Joi.string().email().required().messages({
        "string.empty": "Email can not be empty",
        "any.required": "Email can not be empty",
      }),
      phone: Joi.string().required().messages({
        "string.empty": "Phone can not be empty",
        "any.required": "Phone can not be empty",
      }),
      mobile: Joi.string().required().messages({
        "string.empty": "Mobile can not be empty",
        "any.required": "Mobile can not be empty",
      }),
      role_id: Joi.string().required().messages({
        "string.empty": "Role id can not be empty",
        "any.required": "Role id can not be empty",
      }),
    },
  },
  updateMe: {
    payload: {
      firstname: Joi.string(),
      lastname: Joi.string(),
      location_id: Joi.string(),
      department: Joi.string(),
      position: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      mobile: Joi.string(),
      backup_email: Joi.string(),
      personal_mobile: Joi.string(),
      linkedin: Joi.string(),
    },
  },
  updateAvatar: {
    payload: {
      avatar: Joi.any(),
    },
  },
  update: {
    params: {
      id: Joi.string().required().messages({
        "string.empty": "Id can not be empty",
        "any.required": "Id can not be empty",
      }),
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
      id: Joi.string().required().messages({
        "string.empty": "Id can not be empty",
        "any.required": "Id can not be empty",
      }),
    },
  },
};
