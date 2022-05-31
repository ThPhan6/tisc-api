import * as Hapi from "@hapi/hapi";
import BrandController from "./brand.controller";
import validate from "./brand.validate";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import BrandResponse from "./brand.response";

export default class BrandRoutes implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new BrandController();

      server.route([
        {
          method: "GET",
          path: ROUTES.GET_LIST_BRAND,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list brand",
            tags: ["api", "Brand"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: BrandResponse.getList,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.GET_ONE_BRAND,
          options: {
            handler: controller.getOne,
            validate: validate.getOne,
            description: "Method that get one brand",
            tags: ["api", "Brand"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: BrandResponse.getOne,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.SEND_EMAIL_INVITE_BRAND,
          options: {
            handler: controller.invite,
            validate: validate.getOne,
            description: "Method that invite brand",
            tags: ["api", "Brand"],
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
