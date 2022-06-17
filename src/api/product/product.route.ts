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
            validate: commonValidate.getList,
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
      ]);

      resolve(true);
    });
  }
}
