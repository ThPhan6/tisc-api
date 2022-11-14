import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import IRoute from "@/helper/route.helper";
import { Server } from "@hapi/hapi";
import { getOneValidation } from "@/validate/common.validate";
import response from "./custom_resource.response";
import validate from "./custom_resource.validate";
import CustomResourceController from "./custom_resource.controller";

export default class CustomResourceRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new CustomResourceController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CUSTOM_RESOURCE.CREATE,
          options: {
            handler: controller.createResource,
            validate: validate.createResource,
            description: "Method that create Custom Resource",
            tags: ["api", "Custom Resource"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.CUSTOM_RESOURCE.GET_LIST,
          options: {
            handler: controller.getListResource,
            validate: validate.getListResource,
            description: "Method that get list Custom Resource",
            tags: ["api", "Custom Resource"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getResourceList,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.CUSTOM_RESOURCE.GET_ALL,
          options: {
            handler: controller.getAllResource,
            validate: validate.getAllResource,
            description: "Method that get list Custom Resource",
            tags: ["api", "Custom Resource"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getAllResource,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.CUSTOM_RESOURCE.GET_ONE,
          options: {
            handler: controller.getOneResource,
            validate: getOneValidation,
            description: "Method that get Custom resource detail",
            tags: ["api", "Custom Resource"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOneResource,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.CUSTOM_RESOURCE.GET_SUMMARY,
          options: {
            handler: controller.getCustomResourceSummary,
            description: "Method that get custom resource summary info",
            tags: ["api", "Custom Resource"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getResourceSummary,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.CUSTOM_RESOURCE.UPDATE,
          options: {
            handler: controller.updateResource,
            validate: validate.updateResource,
            description: "Method that update Custom Resource",
            tags: ["api", "Custom Resource"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.CUSTOM_RESOURCE.DELETE,
          options: {
            handler: controller.deleteResource,
            validate: getOneValidation,
            description: "Method that delete Custom Resource",
            tags: ["api", "Custom Resource"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
