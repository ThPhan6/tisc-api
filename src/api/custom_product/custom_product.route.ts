import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import IRoute from "@/helper/route.helper";
import { Server } from "@hapi/hapi";
import { getOneValidation } from "@/validate/common.validate";
import response from "./custom_product.response";
import validate from "./custom_product.validate";
import CustomProductController from "./custom_product.controller";

export default class CustomProductRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new CustomProductController();

      server.route([
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
          method: "POST",
          path: ROUTES.CUSTOM_PRODUCT.DUPLICATE,
          options: {
            handler: controller.duplicateProduct,
            validate: getOneValidation,
            description: "Method that duplicate a custom product",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOneProduct,
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
                200: response.getProductList,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.CUSTOM_PRODUCT.GET_ONE,
          options: {
            handler: controller.getOneProduct,
            validate: getOneValidation,
            description: "Method that get Custom product detail",
            tags: ["api", "Custom Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOneProduct,
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
      ]);
      resolve(true);
    });
  }
}
