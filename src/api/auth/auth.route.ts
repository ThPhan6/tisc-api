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

export default class AuthRoutes implements IRoute {
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
          path: `${PREFIX}/resend-email/{type}/{email}`,
          options: {
            handler: controller.resendEmail,
            validate: validate.resenEmail,
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
      ]);

      resolve(true);
    });
  }
}
