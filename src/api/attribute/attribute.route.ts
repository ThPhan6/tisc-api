import * as Hapi from "@hapi/hapi";
import AttributeController from "./attribute.controller";
import commonValidate from "@/validate/common.validate";
import validate from "./attribute.validate";
import IRoute from "@/helper/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import { AUTH_NAMES } from "@/constant/auth.constant";
import response from "./attribute.response";
import { ROUTES } from "@/constants";

export default class AttributeRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new AttributeController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_ATTRIBUTE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create attribute",
            tags: ["api", "Attribute"],
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
          method: "GET",
          path: ROUTES.GET_ONE_ATTRIBUTE,
          options: {
            handler: controller.get,
            validate: commonValidate.getOne,
            description: "Method that get one attribute",
            tags: ["api", "Attribute"],
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
          method: "GET",
          path: ROUTES.GET_LIST_ATTRIBUTE,
          options: {
            handler: controller.getList,
            validate: validate.getListWithMultipleSort,
            description: "Method that get list attribute",
            tags: ["api", "Attribute"],
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
          path: ROUTES.GET_LIST_CONTENT_TYPE,
          options: {
            handler: controller.getListContentType,
            description: "Method that get list content type",
            tags: ["api", "Attribute"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getListContentType,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_ATTRIBUTE,
          options: {
            handler: controller.delete,
            validate: commonValidate.getOne,
            description: "Method that delete one attribute",
            tags: ["api", "Attribute"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_ATTRIBUTE,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update one attribute",
            tags: ["api", "Attribute"],
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
          method: "GET",
          path: ROUTES.GET_ALL_ATTRIBUTE,
          options: {
            handler: controller.getAllAttribute,
            description: "Method that get all attribute",
            tags: ["api", "Attribute"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getAllAttribute,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
