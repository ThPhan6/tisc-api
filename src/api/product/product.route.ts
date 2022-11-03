import * as Hapi from "@hapi/hapi";
import ProductController from "./product.controller";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { AUTH_NAMES } from "@/constants";
import ProductResponse from "./product.response";
import { getOneValidation } from "@/validate/common.validate";
import validate from "./product.validate";
import { imageOptionPayload, ROUTES } from "@/constants";

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
          method: "GET",
          path: ROUTES.GET_LIST_DESIGNER_BRAND_PRODUCTS,
          options: {
            handler: controller.getListDesignerBrandProducts,
            validate: validate.getListDesignerBrandProducts,
            description: "Method that get list product for designer",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getListDesignerProducts,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.LIKE_OR_UNLIKE_PRODUCT,
          options: {
            handler: controller.likeOrUnlike,
            validate: getOneValidation,
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
            validate: getOneValidation,
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
            payload: imageOptionPayload,
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
            validate: getOneValidation,
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
            validate: getOneValidation,
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
            validate: getOneValidation,
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
        {
          method: "GET",
          path: ROUTES.GET_PRODUCT_OPTIONS,
          options: {
            handler: controller.getProductOptions,
            validate: validate.getProductOptions,
            description: "Method that get list product options",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getProductOptions,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.SHARE_PRODUCT_BY_EMAIL,
          options: {
            handler: controller.shareByEmail,
            validate: validate.shareByEmail,
            description: "Method that share product via email",
            tags: ["api", "Product"],
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
