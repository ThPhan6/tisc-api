import * as Joi from "joi";
import { EMAIL_TYPE } from "../../constant/common.constant";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()+=~`{}|/:;‘“<>[,.-])[A-Za-z\d@$!%*?&_#^()+=~`{}|/:;’“<>[,.-]{8,}$/;

export default {
  isValidResetPasswordToken: {
    params: {
      token: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Token is required")),
    },
  },
  login: {
    payload: {
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Email is required")),
      password: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Password is required")),
    },
  },
  register: {
    payload: {
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Email is required")),
      firstname: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("First name is required")),
      lastname: Joi.string(),
      company_name: Joi.string().allow(null, ""),
      password: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Password is required and valid")
        ),
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
      verification_token: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Verification token is required")
        ),
    },
  },
  createPasswordAndVerify: {
    params: {
      verification_token: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Verification token is required")
        ),
    },
    payload: {
      password: Joi.string()
        .required()
        .regex(regexPassword)
        .error(
          commonFailValidatedMessageFunction("Password is required and valid")
        ),
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
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Email is required")),
    },
  },
  resetPassword: {
    payload: {
      reset_password_token: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Reset password is required")
        ),
      password: Joi.string()
        .required()
        .regex(regexPassword)
        .error(
          commonFailValidatedMessageFunction("Password is required and valid")
        ),
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
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Email is required")),
    },
  },
  checkEmail: {
    params: {
      email: Joi.string()
        .email()
        .required()
        .error(commonFailValidatedMessageFunction("Email is required")),
    },
  },
};
