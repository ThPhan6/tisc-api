import IRoute from "@/helpers/route.helper";
import { Server } from "@hapi/hapi";
import WarehouseController from "./warehouse.controller";

export default class WarehouseRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new WarehouseController();

      server.route([]);

      resolve(true);
    });
  }
}
