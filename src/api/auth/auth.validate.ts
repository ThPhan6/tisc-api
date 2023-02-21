import { AUTH_EMAIL_TYPE } from "@/constants";
import {
  errorMessage,
  requireEmailValidation,
  requirePasswordValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

export default {
  checkTokenExisted: {
    params: {
      token: requireStringValidation("Token"),
    },
  },
  login: {
    payload: {
      email: requireEmailValidation(),
      password: requireStringValidation("Password"),
    },
  },
  register: {
    payload: {
      email: requireEmailValidation(),
      firstname: requireStringValidation("First name / last name", undefined, true),
      lastname: Joi.string(),
      company_name: Joi.string().allow(null, ""),
      password: requirePasswordValidation,
      confirmed_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .error(
          errorMessage(
            "Password confirmation is required and match with password"
          )
        ),
    },
  },
  verify: {
    params: {
      verification_token: requireStringValidation("Verification token"),
    },
  },
  createPasswordAndVerify: {
    params: {
      verification_token: requireStringValidation("Verification token"),
    },
    payload: {
      password: requirePasswordValidation,
      confirmed_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .error(
          errorMessage(
            "Password confirmation is required and match with password"
          )
        ),
    },
  },
  resendEmail: {
    params: {
      type: Joi.string()
        .valid(AUTH_EMAIL_TYPE.FORGOT_PASSWORD, AUTH_EMAIL_TYPE.VERIFICATION)
        .required()
        .error(errorMessage("Type email resend is required")),
      email: requireEmailValidation(),
    },
  },
  resetPassword: {
    payload: {
      reset_password_token: requireStringValidation("Reset password token"),
      password: requirePasswordValidation,
      confirmed_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .error(
          errorMessage(
            "Password confirmation is required and match with password"
          )
        ),
    },
  },
  forgotPassword: {
    payload: {
      email: requireEmailValidation(),
      type: Joi.number(),
    },
  },
  checkEmail: {
    params: {
      email: requireEmailValidation(),
    },
  },
};
