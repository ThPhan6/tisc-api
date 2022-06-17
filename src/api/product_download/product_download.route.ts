import { Server } from "@hapi/hapi";
import IRoute from "../../helper/route.helper";

export default class ProductDownloadRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise(async (resolve) => {
      const controller = new ProductDownLoadController();
    });
  }
}
