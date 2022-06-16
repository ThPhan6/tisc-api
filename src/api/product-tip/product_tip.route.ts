import { generalMessageResponse } from "./../../helper/response.helper";
import { Server } from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import IRoute from "../../helper/route.helper";
import ProductTipController from "./product_tip.controller";
import validate from "./product_tip.validate";
import response from "./product_tip.response";
import commonValidate from "../../validate/common.validate";
export default class ProductTipRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProductTipController();
      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_PRODUCT_TIP,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create product tip",
            tags: ["api", "Product tip"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.productTip,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_LIST_PRODUCT_TIP,
          options: {
            handler: controller.getList,
            // validate: validate.create,
            description: "Method that get list product tip",
            tags: ["api", "Product tip"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.productTips,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_PRODUCT_TIP,
          options: {
            handler: controller.getById,
            validate: commonValidate.getOne,
            description: "Method that get one product tip",
            tags: ["api", "Product tip"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.productTip,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.EDIT_PRODUCT_TIP,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update product tip",
            tags: ["api", "Product tip"],
            // auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.productTip,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.DELETE_PRODUCT_TIP,
          options: {
            handler: controller.delete,
            validate: commonValidate.getOne,
            description: "Method that delete product tip",
            tags: ["api", "Product tip"],
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
