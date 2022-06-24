import * as Joi from "joi";
import { EMAIL_TYPE } from "../../constant/common.constant";
const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()+=~`{}|/:;‘“<>[,.-])[A-Za-z\d@$!%*?&_#^()+=~`{}|/:;’“<>[,.-]{8,}$/;

export default {
  isValidResetPasswordToken: {
    params: {
      token: Joi.string()
        .required()
        .error(() => new Error("Token is required")),
    },
  },
  login: {
    payload: {
      email: Joi.string()
        .email()
        .required()
        .error(() => new Error("Email is required")),
      password: Joi.string()
        .required()
        .error(() => new Error("Password is required")),
    },
  },
  register: {
    payload: {
      email: Joi.string()
        .email()
        .required()
        .error(() => new Error("Email is required")),
      firstname: Joi.string()
        .required()
        .error(() => new Error("First name is required")),

      lastname: Joi.string()
        .required()
        .error(() => new Error("Last name is required")),
      company_name: Joi.string().allow(null, ""),
      password: Joi.string()
        .required()
        .error(() => new Error("Password is required and valid")),
    },
  },
  verify: {
    params: {
      verification_token: Joi.string()
        .required()
        .error(() => new Error("Verification token is required")),
    },
  },
  createPasswordAndVerify: {
    params: {
      verification_token: Joi.string()
        .required()
        .error(() => new Error("Verification token is required")),
    },
    payload: {
      password: Joi.string()
        .required()
        .regex(regexPassword)
        .error(() => new Error("Password is required and valid")),
      confirmed_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .error(
          () =>
            new Error(
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
        .error(() => new Error("Type email resend is required")),
      email: Joi.string()
        .email()
        .required()
        .error(() => new Error("Email is required")),
    },
  },
  resetPassword: {
    payload: {
      reset_password_token: Joi.string()
        .required()
        .error(() => new Error("Reset password is required")),
      password: Joi.string()
        .required()
        .regex(regexPassword)
        .error(() => new Error("Password is required and valid")),

      confirmed_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .error(
          () =>
            new Error(
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
        .error(() => new Error("Email is required")),
    },
  },
};
