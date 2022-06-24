import * as Joi from "joi";

export default {
  create: {
    payload: {
      firstname: Joi.string()
        .required()
        .error(() => new Error("First name is required")),
      lastname: Joi.string()
        .required()
        .error(() => new Error("Last name is required")),
      gender: Joi.boolean()
        .required()
        .error(() => new Error("Gender is required")),
      location_id: Joi.string()
        .required()
        .error(() => new Error("Location id is required")),

      department: Joi.string()
        .required()
        .error(() => new Error("Department is required")),
      position: Joi.string()
        .required()
        .error(() => new Error("Position is required")),

      email: Joi.string()
        .email()
        .required()
        .error(() => new Error("Email is required")),
      phone: Joi.string()
        .required()
        .error(() => new Error("Phone is required")),

      mobile: Joi.string()
        .required()
        .error(() => new Error("Mobile is required")),
      role_id: Joi.string()
        .required()
        .error(() => new Error("Role id is required")),
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
        .error(() => new Error("Id is required")),
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
        .error(() => new Error("Id is required")),
    },
  },
};
