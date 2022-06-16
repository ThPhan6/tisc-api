import { Server } from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import IRoute from "../../helper/route.helper";
import ProductTipController from "./product_tip.controller";
import validate from "./product_tip.validate";
import response from "./product_tip.response";
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
      ]);
    });
  }
}
