import * as Hapi from "@hapi/hapi";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  statuses,
} from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import EmailAutoController from "./email_auto.controller";
import validate from "./email_auto.validate";
import response from "./email_auto.response";
import commonValidate from "../../validate/common.validate";

export default class EmailAutoRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new EmailAutoController();

      server.route([
        {
          method: "GET",
          path: ROUTES.GET_LIST_EMAIL_AUTO_TOPIC,
          options: {
            handler: controller.getListTopic,
            description: "Method that get list topic email auto ",
            tags: ["api", "Email Auto"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                200: statuses,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_EMAIL_AUTO_TARGETED_FOR,
          options: {
            handler: controller.getListTargetedFor,
            description: "Method that get list targeted for email auto",
            tags: ["api", "Email Auto"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                200: statuses,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_EMAIL_AUTO,
          options: {
            handler: controller.getList,
            validate: commonValidate.getList,
            description: "Method that get list email auto",
            tags: ["api", "Email Auto"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getList,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_EMAIL_AUTO,
          options: {
            handler: controller.getOne,
            validate: commonValidate.getOne,
            description: "Method that get one email auto",
            tags: ["api", "Email Auto"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_EMAIL_AUTO,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update email auto",
            tags: ["api", "Email Auto"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
