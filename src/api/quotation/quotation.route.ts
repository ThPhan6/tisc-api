import * as Hapi from "@hapi/hapi";
import commonValidate from "../../validate/common.validate";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import validate from "./quotation.validate";
import response from "./quotation.response";
import QuotationController from "./quotation.controller";
export default class QuotationRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new QuotationController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_QUOTATION,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create quotation",
            tags: ["api", "Quotation"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
