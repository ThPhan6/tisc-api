import { Server } from "@hapi/hapi";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import IRoute from "../../helper/route.helper";
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
                200: response,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
