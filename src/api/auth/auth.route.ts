import * as Hapi from "@hapi/hapi";
import AuthController from "./auth.controller";
import validate from "./auth.validate";
import IRoute from "../../helper/route.helper";
const PREFIX = "/api/auth";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "../../helper/response.helper";
import authResponse from "./auth.response";

export default class AuthRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new AuthController();

      server.route([
        {
          method: "POST",
          path: `${PREFIX}/login`,
          options: {
            handler: controller.login,
            validate: validate.login,
            description: "Method that authenticate user",
            tags: ["api", "Authentication"],
            auth: false,
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
          path: `${PREFIX}/brand-design/login`,
          options: {
            handler: controller.brandLogin,
            validate: validate.login,
            description: "Method that authenticate brand user",
            tags: ["api", "Authentication"],
            auth: false,
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
          path: `/api/auth/is-valid-reset-password-token/{token}`,
          options: {
            handler: controller.isValidResetPasswordToken,
            validate: validate.isValidResetPasswordToken,
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
          path: `${PREFIX}/forgot-password`,
          options: {
            handler: controller.forgotPassword,
            validate: validate.forgotPassword,
            description: "Method that return reset password token to user",
            tags: ["api", "Authentication"],
            auth: false,
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
          path: `${PREFIX}/reset-password`,
          options: {
            handler: controller.resetPassword,
            validate: validate.resetPassword,
            description: "Method that reset password for user",
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
          path: `${PREFIX}/reset-password-and-login`,
          options: {
            handler: controller.resetPasswordAndLogin,
            validate: validate.resetPassword,
            description: "Method that reset password and login",
            tags: ["api", "Authentication"],
            auth: false,
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
          path: `${PREFIX}/register`,
          options: {
            handler: controller.register,
            validate: validate.register,
            description: "Method that register an user",
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
          path: `${PREFIX}/verify/{verification_token}`,
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
          path: `${PREFIX}/create-password-verify/{verification_token}`,
          options: {
            handler: controller.createPasswordAndVerify,
            validate: validate.createPasswordAndVerify,
            description: "Method that create password and verify an user",
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
          path: `${PREFIX}/resend-email/{type}/{email}`,
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
          path: `${PREFIX}/check-email/{email}`,
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
