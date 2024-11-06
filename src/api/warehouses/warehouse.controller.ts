import { Request, ResponseToolkit } from "@hapi/hapi";
import { warehouseService } from "./warehouse.service";
import { WarehouseCreate } from "./warehouse.type";
import { UserAttributes } from "@/types";

export default class WarehouseController {
  public async getList(req: Request, toolkit: ResponseToolkit) {
    const response = await warehouseService.getList(req.params.id);
    return toolkit.response(response).code(response.statusCode);
  }

  public async create(
    req: Request & { payload: WarehouseCreate },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await warehouseService.create(user, req.payload);

    return toolkit.response(response).code(response.statusCode);
  }

  public async delete(req: Request, toolkit: ResponseToolkit) {
    const response = await warehouseService.delete(req.params.id);
    return toolkit.response(response).code(response.statusCode);
  }
}
