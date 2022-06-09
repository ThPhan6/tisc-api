import {
  generalMessageResponse,
  defaultRouteOptionResponseStatus,
} from "../../helper/response.helper";
import { AUTH_NAMES } from "../../constant/auth.constant";
import * as Hapi from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import IRoute from "../../helper/route.helper";
import CategoryController from "./category.controller";
import productSettingResponse from "./category.reponse";
import validate from "./category.validate";
import commonValidate from "../../validate/common.validate";
export default class CategoryRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new CategoryController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_CATEGORY,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create category",
            tags: ["api", "Category"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: productSettingResponse.category,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_CATEGORY,
          options: {
            handler: controller.getList,
            validate: commonValidate.getList,
            description: "Method that get categories",
            tags: ["api", "Category"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: productSettingResponse.categories,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_CATEGORY,
          options: {
            handler: controller.get,
            validate: commonValidate.getOne,
            description: "Method that get category",
            tags: ["api", "Category"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: productSettingResponse.category,
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
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: productSettingResponse.category,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_CATEGORY,
          options: {
            handler: controller.delete,
            validate: commonValidate.getOne,
            description: "Method that delete category",
            tags: ["api", "Category"],
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
