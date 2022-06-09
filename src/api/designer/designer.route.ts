import * as Hapi from "@hapi/hapi";
import DesignerController from "./designer.controller";
import commonValidate from "../../validate/common.validate";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import DesignerResponse from "./designer.response";

export default class DesignerRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new DesignerController();

      server.route([
        {
          method: "GET",
          path: ROUTES.GET_LIST_DESIGN_FIRM,
          options: {
            handler: controller.getList,
            validate: commonValidate.getListJustWithLimitOffset,
            description: "Method that get list design firm",
            tags: ["api", "Designer"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: DesignerResponse.getList,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_DESIGN_FIRM,
          options: {
            handler: controller.getOne,
            validate: commonValidate.getOne,
            description: "Method that get one design firm",
            tags: ["api", "Designer"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: DesignerResponse.getOne,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
