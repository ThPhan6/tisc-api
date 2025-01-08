import * as HapiJoi from "joi";
import { IUserCompanyResponse } from "../user/user.type";
import { UserType } from "@/types";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

const loginResponse = (
  value: IUserCompanyResponse,
  _helpers_helpers: HapiJoi.CustomHelpers
) => {
  switch (value.type) {
    case UserType.TISC:
      return Joi.object({
        token: Joi.string(),
        type: Joi.string(),
      });

    default:
      return Joi.array().items(
        Joi.object({
          token: Joi.string(),
          type: Joi.any(),
          workspace_id: Joi.string(),
          workspace_name: Joi.string(),
        })
      );
  }
};

export default {
  login: Joi.object({
    message: Joi.string(),
    statusCode: Joi.number(),
    data: Joi.custom(loginResponse).allow(null),
  }),
  isValidToken: Joi.object({
    data: Joi.valid(true, false),
    statusCode: Joi.number(),
  }) as any,
  forgotPassword: Joi.object({
    reset_password_token: Joi.string(),
    message: Joi.string(),
    statusCode: Joi.number(),
  }) as any,
};
