import { EMAIL_TYPE } from "@/constant/common.constant";
import {
  commonFailValidatedMessageFunction,
  requireEmailValidation,
  requirePasswordValidation,
  requireStringValidation,
} from "@/validate/common.validate";
import * as Joi from "joi";

export default {
  isValidResetPasswordToken: {
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
      firstname: requireStringValidation("First name"),
      lastname: Joi.string(),
      company_name: Joi.string().allow(null, ""),
      password: requirePasswordValidation,
      confirmed_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .error(
          commonFailValidatedMessageFunction(
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
          commonFailValidatedMessageFunction(
            "Password confirmation is required and match with password"
          )
        ),
    },
  },
  resendEmail: {
    params: {
      type: Joi.string()
        .valid(EMAIL_TYPE.FORGOT_PASSWORD, EMAIL_TYPE.VERIFICATION)
        .required()
        .error(
          commonFailValidatedMessageFunction("Type email resend is required")
        ),
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
          commonFailValidatedMessageFunction(
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
