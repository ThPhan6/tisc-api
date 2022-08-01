import * as Hapi from "@hapi/hapi";
import ConsideredProductController from "./considered_product.controller";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import ProductResponse from "./considered_product.response";
import validate from "./considered_product.validate";

export default class ConsideredProductRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ConsideredProductController();

      server.route([
        {
          method: "GET",
          path: ROUTES.GET_CONSIDERED_PRODUCTS,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list considered product",
            tags: ["api", "Considered Product"],
            auth: AUTH_NAMES.PERMISSION,
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
          path: ROUTES.GET_CONSIDERED_PRODUCT_STATUS,
          options: {
            handler: controller.getConsideredProductStatusOptions,
            description: "Method that get list considered product status",
            tags: ["api", "Considered Product"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: ProductResponse.getListStatus,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
