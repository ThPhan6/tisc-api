import * as Joi from "@hapi/joi";
import { EMAIL_TYPE } from "../../constant/common.constant";
const regexPassword =
  /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export default {
  login: {
    payload: {
      email: Joi.string().email().required().messages({
        "string.empty": "Email can not be empty",
        "any.required": "Email can not be empty",
      }),
      password: Joi.string().required().messages({
        "string.empty": "Password can not be empty",
        "any.required": "Password can not be empty",
      }),
    },
  },
  register: {
    payload: {
      email: Joi.string().email().required().messages({
        "string.empty": "Email can not be empty",
        "any.required": "Email can not be empty",
      }),
      fullname: Joi.string().required().messages({
        "string.empty": "Full name can not be empty",
        "any.required": "Full name can not be empty",
      }),
      company_name: Joi.string().allow(null, ""),
      password: Joi.string().required().messages({
        "string.empty": "Password can not be empty",
        "any.required": "Password can not be empty",
        "string.pattern.base": "Password is not valid",
      }),
    },
  },
  verify: {
    params: {
      verification_token: Joi.string().required().messages({
        "string.empty": "Verification token can not be empty",
        "any.required": "Verification token can not be empty",
      }),
    },
  },
  createPasswordAndVerify: {
    params: {
      verification_token: Joi.string().required().messages({
        "string.empty": "Verification token can not be empty",
        "any.required": "Verification token can not be empty",
      }),
    },
    payload: {
      password: Joi.string().required().regex(regexPassword).messages({
        "string.empty": "Password can not be empty",
        "any.required": "Password can not be empty",
        "string.pattern.base": "Password is not valid",
      }),
      confirmed_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "string.empty": "Password confirmation can not be empty",
          "any.required": "Password confirmation can not be empty",
          "any.only": "Password confirmation does not match",
        }),
    },
  },
  resenEmail: {
    params: {
      type: Joi.string().valid(
        EMAIL_TYPE.FORGOT_PASSWORD,
        EMAIL_TYPE.VERIFICATION
      ),
      email: Joi.string().email().required().messages({
        "string.empty": "Email can not be empty",
        "any.required": "Email can not be empty",
      }),
    },
  },
  resetPassword: {
    payload: {
      reset_password_token: Joi.string().required().messages({
        "string.empty": "Reset password token can not be empty",
        "any.required": "Reset password token can not be empty",
      }),
      password: Joi.string().required().regex(regexPassword).messages({
        "string.empty": "Password can not be empty",
        "any.required": "Password can not be empty",
        "string.pattern.base": "Password is not valid",
      }),
      confirmed_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "string.empty": "Password confirmation can not be empty",
          "any.required": "Password confirmation can not be empty",
          "any.only": "Password confirmation does not match",
        }),
    },
  },
  forgotPassword: {
    payload: {
      email: Joi.string().email().required().messages({
        "string.empty": "Email can not be empty",
        "any.required": "Email can not be empty",
      }),
    },
  },
};
