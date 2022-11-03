import * as Hapi from "@hapi/hapi";
import PermissionController from "./permission.controller";
import IRoute from "../../helper/route.helper";
import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import response from "./permission.response";
import { getOneValidation } from "@/validate/common.validate";

export default class PermissionRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new PermissionController();

      server.route([
        {
          method: "GET",
          path: ROUTES.GET_LIST_PERMISSION,
          options: {
            handler: controller.getList,
            description: "Method that get list permission",
            tags: ["api", "Permission"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getList,
              },
            },
          },
        },
        {
          method: "PUT",
          path: ROUTES.OPEN_CLOSE_PERMISSION,
          options: {
            handler: controller.openClose,
            validate: getOneValidation,
            description: "Method that open or close permission",
            tags: ["api", "Permission"],
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
