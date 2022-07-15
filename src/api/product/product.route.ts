import * as Hapi from "@hapi/hapi";
import ProductController from "./product.controller";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import ProductResponse from "./product.response";
import commonValidate from "../../validate/common.validate";
import validate from "./product.validate";

export default class ProductRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProductController();

      server.route([
        {
          method: "GET",
          path: ROUTES.GET_LIST_PRODUCT,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list product",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getList,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.LIKE_OR_UNLIKE_PRODUCT,
          options: {
            handler: controller.likeOrUnlike,
            validate: commonValidate.getOne,
            description: "Method that like or unlike product",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_BRAND_PRODUCT_SUMMARY,
          options: {
            handler: controller.getBrandProductSummary,
            validate: validate.getBrandProductSummary,
            description: "Method that get brand summary",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.brandProductSummary,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_PRODUCT,
          options: {
            handler: controller.get,
            validate: commonValidate.getOne,
            description: "Method that get one product",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getOne,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.CREATE_PRODUCT,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create one product",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getOne,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.DUPLICATE_PRODUCT,
          options: {
            handler: controller.duplicate,
            validate: commonValidate.getOne,
            description: "Method that duplicate product",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getOne,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.UPDATE_PRODUCT,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update product",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getOne,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_PRODUCT,
          options: {
            handler: controller.delete,
            validate: commonValidate.getOne,
            description: "Method that delete product",
            tags: ["api", "Product"],
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
          path: ROUTES.GET_LIST_REST_COLLECTION_PRODUCT,
          options: {
            handler: controller.getListRestCollectionProduct,
            validate: commonValidate.getOne,
            description: "Method that get list rest collection product",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getListRestCollectionProduct,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
