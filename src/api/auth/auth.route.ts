import * as Hapi from "@hapi/hapi";
import AuthController from "./auth.controller";
import validate from "./auth.validate";
import IRoute from "@/helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "@/helper/response.helper";
import authResponse from "./auth.response";
import { AUTH_NAMES, ROUTES } from "@/constants";
import { preventAttempt } from "@/middleware/prevent_attempt.middleware";

export default class AuthRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new AuthController();

      server.route([
        {
          method: "POST",
          path: ROUTES.AUTH.TISC_LOGIN,
          options: {
            handler: controller.login,
            validate: validate.login,
            description: "Method that authenticate user",
            tags: ["api", "Authentication"],
            auth: AUTH_NAMES.CAPTCHA,
            pre: [preventAttempt],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: authResponse.login,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.AUTH.BRAND_DESIGN_LOGIN,
          options: {
            handler: controller.brandLogin,
            validate: validate.login,
            description: "Method that authenticate brand user",
            tags: ["api", "Authentication"],
            auth: AUTH_NAMES.CAPTCHA,
            pre: [preventAttempt],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: authResponse.login,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.AUTH.VALIDATE_RESET_TOKEN,
          options: {
            handler: controller.checkTokenExisted,
            validate: validate.checkTokenExisted,
            description: "Method that check valid reset password token",
            tags: ["api", "Authentication"],
            auth: false,
            response: {
              status: {
                200: authResponse.isValidToken,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.AUTH.FORGOT_PASSWORD,
          options: {
            handler: controller.forgotPassword,
            validate: validate.forgotPassword,
            description: "Method that return reset password token to user",
            tags: ["api", "Authentication"],
            auth: AUTH_NAMES.CAPTCHA,
            pre: [preventAttempt],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: authResponse.forgotPassword,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.AUTH.RESET_PASSWORD,
          options: {
            handler: controller.resetPassword,
            validate: validate.resetPassword,
            description: "Method that reset password for user",
            tags: ["api", "Authentication"],
            auth: AUTH_NAMES.CAPTCHA,
            pre: [preventAttempt],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.AUTH.RESET_PASSWORD_AND_LOGIN,
          options: {
            handler: controller.resetPasswordAndLogin,
            validate: validate.resetPassword,
            description: "Method that reset password and login",
            tags: ["api", "Authentication"],
            auth: AUTH_NAMES.CAPTCHA,
            pre: [preventAttempt],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: authResponse.login,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.AUTH.DESIGN_REGISTER,
          options: {
            handler: controller.register,
            validate: validate.register,
            description: "Method that register an user",
            tags: ["api", "Authentication"],
            auth: AUTH_NAMES.CAPTCHA,
            pre: [preventAttempt],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.AUTH.ACCOUNT_VERIFY,
          options: {
            handler: controller.verify,
            validate: validate.verify,
            description: "Method that verify an user registration",
            tags: ["api", "Authentication"],
            auth: false,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.AUTH.CREATE_PASSWORD_VERIFY,
          options: {
            handler: controller.createPasswordAndVerify,
            validate: validate.createPasswordAndVerify,
            description: "Method that create password and verify an user",
            tags: ["api", "Authentication"],
            auth: AUTH_NAMES.CAPTCHA,
            pre: [preventAttempt],
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: authResponse.login,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.AUTH.RESEND_EMAIL,
          options: {
            handler: controller.resendEmail,
            validate: validate.resendEmail,
            description: "Method that resend email",
            tags: ["api", "Authentication"],
            auth: false,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.AUTH.VALIDATE_EMAIL,
          options: {
            handler: controller.checkEmail,
            validate: validate.checkEmail,
            description: "Method that check email is available or not.",
            tags: ["api", "Authentication"],
            auth: false,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
