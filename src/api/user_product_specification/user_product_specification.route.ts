import * as Hapi from "@hapi/hapi";
import IRoute from "@/helper/route.helper";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import { ROUTES } from "@/constant/api.constant";
import { AUTH_NAMES } from "@/constant/auth.constant";
import UserProductSpecificationController from "./user_product_specification.controller";
import validate from "./user_product_specification.validate";

export default class UserProductSpecificationRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserProductSpecificationController();

      server.route([
        {
          method: "POST",
          path: ROUTES.UPDATE_USER_SPEC_SELECTION,
          options: {
            handler: controller.selectSpecification,
            validate: validate.selectSpecification,
            description: "Method that select product specification",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: { status: defaultRouteOptionResponseStatus },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_USER_SPEC_SELECTION,
          options: {
            handler: controller.getSelectedSpecification,
            validate: validate.getSelectedSpecification,
            description: "Method that return selected product specification",
            tags: ["api", "Product"],
            auth: AUTH_NAMES.PERMISSION,
            response: { status: defaultRouteOptionResponseStatus },
          },
        },
      ]);

      resolve(true);
    });
  }
}
