import * as Hapi from "@hapi/hapi";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  statuses,
} from "../../helper/response.helper";
import { AUTH_NAMES } from "../../constant/auth.constant";
import AutoEmailController from "./auto_email.controller";
import validate from "./auto_email.validate";
import response from "./auto_email.response";
import {
  getListValidation,
  getOneValidation,
} from "../../validate/common.validate";
import { ROUTES } from "@/constants";

export default class AutoEmailRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new AutoEmailController();
      server.route([
        {
          method: "GET",
          path: ROUTES.GET_LIST_AUTO_EMAIL_TOPIC,
          options: {
            handler: controller.getListTopic,
            description: "Method that get list topic auto email",
            tags: ["api", "Auto Email"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                200: statuses,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_AUTO_EMAIL_TARGETED_FOR,
          options: {
            handler: controller.getListTargetedFor,
            description: "Method that get list targeted for auto email",
            tags: ["api", "Auto Email"],
            auth: AUTH_NAMES.GENERAL,
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
            validate: getListValidation({
              custom: (value) => ({
                sort: value.sort || "updated_at",
              }),
            }),
            description: "Method that get list auto email",
            tags: ["api", "Auto Email"],
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
            validate: getOneValidation,
            description: "Method that get one auto email",
            tags: ["api", "Auto Email"],
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
            description: "Method that update auto email",
            tags: ["api", "Auto Email"],
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
