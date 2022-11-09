import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import IRoute from "@/helper/route.helper";
import { Server } from "@hapi/hapi";
import { getOneValidation } from "@/validate/common.validate";
import CustomLibraryController from "./custom_library.controller";
// import response from "./custom_library.response";
import validate from "./custom_library.validate";

export default class ActionTaskRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new CustomLibraryController();

      server.route([
        {
          method: "GET",
          path: ROUTES.CUSTOM_LIBRARY.GET_LIST,
          options: {
            handler: controller.getListProduct,
            validate: validate.getListProduct,
            description: "Method that get list Custom Library Product",
            tags: ["api", "Custom Library"],
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
          path: ROUTES.CUSTOM_LIBRARY_COMPANY.GET_LIST,
          options: {
            handler: controller.getListCompany,
            validate: validate.getListCompany,
            description: "Method that get list Custom Library Product",
            tags: ["api", "Custom Library"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.CUSTOM_LIBRARY.CREATE,
          options: {
            handler: controller.createProduct,
            validate: validate.createProduct,
            description: "Method that create Custom Library Product",
            tags: ["api", "Custom Library"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.CUSTOM_LIBRARY_COMPANY.CREATE,
          options: {
            handler: controller.createCompany,
            validate: validate.createCompany,
            description: "Method that create Custom Library Company",
            tags: ["api", "Custom Library"],
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
          path: ROUTES.CUSTOM_LIBRARY.UPDATE,
          options: {
            handler: controller.updateProduct,
            validate: validate.updateProduct,
            description: "Method that update Custom Library Product",
            tags: ["api", "Custom Library"],
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
          path: ROUTES.CUSTOM_LIBRARY_COMPANY.UPDATE,
          options: {
            handler: controller.updateCompany,
            validate: validate.updateCompany,
            description: "Method that update Custom Library Company",
            tags: ["api", "Custom Library"],
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
          path: ROUTES.CUSTOM_LIBRARY.DELETE,
          options: {
            handler: controller.deleteProduct,
            validate: getOneValidation,
            description: "Method that delete Custom Library Product",
            tags: ["api", "Custom Library"],
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
          path: ROUTES.CUSTOM_LIBRARY_COMPANY.DELETE,
          options: {
            handler: controller.deleteCompany,
            validate: getOneValidation,
            description: "Method that delete Custom Library Company",
            tags: ["api", "Custom Library"],
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
