import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helpers/response.helper";
import IRoute from "@/helpers/route.helper";
import { Server } from "@hapi/hapi";
import InventoryController from "./inventory.controller";
import validate from "./inventory.validate";

export default class InventoryRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new InventoryController();

      server.route([
        {
          method: "GET",
          path: ROUTES.INVENTORY.GET_ONE,
          options: {
            handler: controller.get,
            validate: validate.get,
            description: "Method that get inventory",
            tags: ["api", "Inventory"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "GET",
          path: ROUTES.INVENTORY.GET_LIST,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get inventory list",
            tags: ["api", "Inventory"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "POST",
          path: ROUTES.INVENTORY.CREATE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create inventory",
            tags: ["api", "Inventory"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "PATCH",
          path: ROUTES.INVENTORY.UPDATE,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update inventory",
            tags: ["api", "Inventory"],
            auth: AUTH_NAMES.GENERAL,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
        {
          method: "DELETE",
          path: ROUTES.INVENTORY.DELETE,
          options: {
            handler: controller.delete,
            validate: validate.delete,
            description: "Method that delete inventory",
            tags: ["api", "Inventory"],
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
