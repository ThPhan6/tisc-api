import { generalMessageResponse } from "./../../helper/response.helper";
import { Server } from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import IRoute from "../../helper/route.helper";
import commonValidate from "../../validate/common.validate";
import ProductDownloadController from "./product_download.controller";
import response from "./product_download.response";
import validate from "./product_download.validate";
export default class ProductDownloadRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise(async (resolve) => {
      const controller = new ProductDownloadController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_PRODUCT_DOWNLOAD,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create product download",
            tags: ["api", "Product download"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.productDownload,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_PRODUCT_DOWNLOAD,
          options: {
            handler: controller.getList,
            description: "Method that get list product download",
            tags: ["api", "Product download"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.productDownloads,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_PRODUCT_DOWNLOAD,
          options: {
            handler: controller.getById,
            validate: commonValidate.getOne,
            description: "Method that get one product download",
            tags: ["api", "Product download"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.productDownload,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_PRODUCT_DOWNLOAD,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update product download",
            tags: ["api", "Product download"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.productDownload,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_PRODUCT_DOWNLOAD,
          options: {
            handler: controller.delete,
            validate: commonValidate.getOne,
            description: "Method that delete product download",
            tags: ["api", "Product download"],
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
          path: ROUTES.GET_LIST_PRODUCT_DOWNLOAD_BY_PRODUCT_ID,
          options: {
            handler: controller.getDownloadsByProductId,
            validate: commonValidate.getOne,
            description: "Method that get product download by product id",
            tags: ["api", "Product download"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.productDownloads,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
