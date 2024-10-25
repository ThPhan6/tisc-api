import * as Hapi from "@hapi/hapi";
import IRoute from "@/helpers/route.helper";
import { AUTH_NAMES, ROUTES } from "@/constants";
import Controller from "./dynamic_category.controller";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "@/helpers/response.helper";
import response from "./dynamic_category.response";
import validate from "./dynamic_category.validate";
import { getOneValidation } from "@/validates/common.validate";
import dotenv from "dotenv";

dotenv.config();

export default class DynamicCategoryRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new Controller();

      server.route([
        {
          method: "GET",
          path: ROUTES.DYNAMIC_CATEGORY.GET_CATEGORIES,
          options: {
            handler: controller.getCategoriesByRelationId,
            description: "Method that get list categories for dynamic category",
            tags: ["api", "Dynamic Category"],
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
          method: "POST",
          path: ROUTES.DYNAMIC_CATEGORY.CREATE_CATEGORY,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create category for dynamic category",
            tags: ["api", "Dynamic Category"],
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
          path: ROUTES.DYNAMIC_CATEGORY.UPDATE_CATEGORY,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update category for dynamic category",
            tags: ["api", "Dynamic Category"],
            auth: AUTH_NAMES.PERMISSION,
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
          path: ROUTES.DYNAMIC_CATEGORY.DETELE_CATEGORY,
          options: {
            handler: controller.delete,
            validate: getOneValidation,
            description: "Method that delete category for dynamic category",
            tags: ["api", "Dynamic Category"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.DYNAMIC_CATEGORY.MOVE,
          options: {
            handler: controller.move,
            validate: validate.move,
            description:
              "Method that move last category to another sub category",
            tags: ["api", "Dynamic Category"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.DYNAMIC_CATEGORY.GROUP_CATEGORIES,
          options: {
            handler: controller.groupCategories,
            description:
              "Method that get list categories after group together based on the relationship",
            tags: ["api", "Dynamic Category"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getAll,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
