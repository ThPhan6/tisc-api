import IRoute from "@/helpers/route.helper";
import { Server } from "@hapi/hapi";
import WarehouseController from "./warehouse.controller";
import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helpers/response.helper";
import validate from "./warehouse.validate";
export default class WarehouseRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new WarehouseController();

      server.route([
        {
          method: "GET",
          path: ROUTES.WAREHOUSE.GET_ONE,
          options: {
            handler: controller.get,
            // validate: validate.get,
            description: "Method that get warehouse",
            tags: ["api", "Warehouse"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                // 200: response.getOne,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.WAREHOUSE.CREATE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create warehouse",
            tags: ["api", "Warehouse"],
            auth: AUTH_NAMES.GENERAL,
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
