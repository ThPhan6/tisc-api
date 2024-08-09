import * as Hapi from "@hapi/hapi";
import Controller from "./label.controller";
import IRoute from "@/helpers/route.helper";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "@/helpers/response.helper";
import { AUTH_NAMES, ROUTES } from "@/constants";
import response from "./label.response";
import validate from "./label.validate";
import { getOneValidation } from "@/validates/common.validate";

export default class LabelRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new Controller();

      server.route([
        {
          method: "GET",
          path: ROUTES.LABEL.GET_LIST,
          options: {
            handler: controller.getList,
            description: "Method that get list label",
            tags: ["api", "Label"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getList,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.LABEL.CREATE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create one label",
            tags: ["api", "Label"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.LABEL.MOVE_TO,
          options: {
            handler: controller.moveSubLabelToLabel,
            validate: validate.moveTo,
            description: "Method that move sub label to another label",
            tags: ["api", "Label"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "PATCH",
          path: ROUTES.LABEL.UPDATE,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update name of label",
            tags: ["api", "Label"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.LABEL.DELETE,
          options: {
            handler: controller.delete,
            validate: getOneValidation,
            description: "Method that delete label",
            tags: ["api", "Label"],
            auth: AUTH_NAMES.GENERAL,
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
