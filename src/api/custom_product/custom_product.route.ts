import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import IRoute from "@/helper/route.helper";
import { Server } from "@hapi/hapi";
import { getOneValidation } from "@/validate/common.validate";
import CustomProductController from "./custom_product.controller";
import response from "./custom_product.response";
import validate from "./custom_product.validate";

export default class CustomProductRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new CustomProductController();

      server.route([
        // Custom product
        {
          method: "POST",
          path: ROUTES.CUSTOM_PRODUCT.CREATE,
          options: {
            handler: controller.createProduct,
            validate: validate.createProduct,
            description: "Method that create Custom Product",
            tags: ["api", "Custom Product"],
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
          path: ROUTES.CUSTOM_PRODUCT.GET_LIST,
          options: {
            handler: controller.getListProduct,
            validate: validate.getListProduct,
            description: "Method that get list Custom Product",
            tags: ["api", "Custom Product"],
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
          path: ROUTES.CUSTOM_PRODUCT.UPDATE,
          options: {
            handler: controller.updateProduct,
            validate: validate.updateProduct,
            description: "Method that update Custom Product",
            tags: ["api", "Custom Product"],
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
          path: ROUTES.CUSTOM_PRODUCT.DELETE,
          options: {
            handler: controller.deleteProduct,
            validate: getOneValidation,
            description: "Method that delete Custom Product",
            tags: ["api", "Custom Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },

        // Custom resource
        {
          method: "POST",
          path: ROUTES.CUSTOM_RESOURCE.CREATE,
          options: {
            handler: controller.createResource,
            validate: validate.createResource,
            description: "Method that create Custom Product Resource",
            tags: ["api", "Custom Product"],
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
            description: "Method that get list Custom Product",
            tags: ["api", "Custom Product"],
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
          path: ROUTES.CUSTOM_RESOURCE.GET_ALL,
          options: {
            handler: controller.getAllResource,
            validate: validate.getAllResource,
            description: "Method that get list Custom Product",
            tags: ["api", "Custom Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getAll,
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
            tags: ["api", "Custom Product"],
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
          path: ROUTES.CUSTOM_RESOURCE.GET_SUMMARY,
          options: {
            handler: controller.getCustomResourceSummary,
            description: "Method that get custom resource summary info",
            tags: ["api", "Custom Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getSummary,
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
            description: "Method that update Custom Product Resource",
            tags: ["api", "Custom Product"],
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
            description: "Method that delete Custom Product Resource",
            tags: ["api", "Custom Product"],
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
