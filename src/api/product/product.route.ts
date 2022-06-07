import { generalMessageResponse } from "./../../helper/response.helper";
import { AUTH_NAMES } from "./../../constant/auth.constant";
import * as Hapi from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import ProductController from "./product.controller";
import productResponse from "./product.reponse";
import validate from "./product.validate";
import commonValidate from "../../validate/common.validate";
export default class ProductRoutes implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProductController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_CATEGORY,
          options: {
            handler: controller.createCategory,
            validate: validate.create,
            description: "Method that create category",
            tags: ["api", "Category"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: productResponse.category,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_CATEGORY,
          options: {
            handler: controller.getListCategory,
            validate: commonValidate.getList,
            description: "Method that get categories",
            tags: ["api", "Category"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: productResponse.categories,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_CATEGORY,
          options: {
            handler: controller.getById,
            validate: validate.getById,
            description: "Method that get category",
            tags: ["api", "Category"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: productResponse.category,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_CATEGORY,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update category",
            tags: ["api", "Category"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: productResponse.category,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_CATEGORY,
          options: {
            handler: controller.delete,
            validate: validate.getById,
            description: "Method that delete category",
            tags: ["api", "Category"],
            // auth: AUTH_NAMES.PERMISSION,
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
