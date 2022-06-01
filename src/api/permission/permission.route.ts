import * as Hapi from "@hapi/hapi";
import PermissionController from "./permission.controller";
import IRoute from "../../helper/route.helper";
import { AUTH_NAMES } from "../../constant/auth.constant";

export default class PermissionRoutes implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new PermissionController();

      server.route([
        {
          method: "GET",
          path: "/api/permission/get-menu",
          options: {
            handler: controller.getMenu,
            description: "Method that get list permission",
            tags: ["api", "Permission"],
            auth: AUTH_NAMES.GENERAL,
          },
        },
      ]);

      resolve(true);
    });
  }
}
