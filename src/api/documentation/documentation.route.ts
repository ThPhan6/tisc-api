import * as Hapi from "@hapi/hapi";
import documentationController from "./documentation.controller";
import validate from "./documentation.validate";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "../../helper/response.helper";
import response from "./documentation.response";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
export default class DocumentationRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new documentationController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_DOCUMENTATION,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create documentation",
            tags: ["api", "Documentation"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.documentation,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_DOCUMENTATION,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list documentation",
            tags: ["api", "Documentation"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.documentations,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ALL_HOWTO,
          options: {
            handler: controller.getAllHowto,
            description: "Method that get all how to documentation",
            tags: ["api", "Documentation"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.allHowto,
              },
            },
          },
        },
        {
          method: "GET",
          path: "/api/documentation/howto/get-current",
          options: {
            handler: controller.getHowto,
            description: "Method that get all how to for current user",
            tags: ["api", "Documentation"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.howtos,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_DOCUMENTATION,
          options: {
            handler: controller.getById,
            validate: validate.getById,
            description: "Method that get documentation by ID",
            tags: ["api", "Documentation"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.documentation,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_DOCUMENTATION,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update documentation",
            tags: ["api", "Documentation"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.documentation,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.UPDATE_HOWTO,
          options: {
            handler: controller.updateHowtos,
            validate: validate.updateHowto,
            description: "Method that update How to",
            tags: ["api", "Documentation"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.howtos,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_DOCUMENTATION,
          options: {
            handler: controller.delete,
            validate: validate.getById,
            description: "Method that delete documentation",
            tags: ["api", "Documentation"],
            auth: AUTH_NAMES.PERMISSION,
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
