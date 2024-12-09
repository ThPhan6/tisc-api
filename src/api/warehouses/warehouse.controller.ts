import { UserAttributes, WarehouseStatus } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { warehouseService } from "./warehouse.service";
import {
  WarehouseCreate,
  WarehouseUpdate,
  WarehouseUpdateBackOrder,
} from "./warehouse.type";

export default class WarehouseController {
  public async getList(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await warehouseService.getList(user, req.params.id, {
      status: WarehouseStatus.ACTIVE,
    });
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

  public async updateMultiple(
    req: Request & { payload: Record<string, WarehouseUpdate> },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;

    const response = await warehouseService.updateMultiple(user, req.payload);
    return toolkit.response(response).code(response.statusCode);
  }

  public async updateMultipleBackOrder(
    req: Request & { payload: WarehouseUpdateBackOrder[] },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await warehouseService.updateMultipleBackOrder(
      user,
      req.payload
    );
    return toolkit.response(response).code(response.statusCode);
  }

  public async delete(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await warehouseService.delete(user, req.params.id);
    return toolkit.response(response).code(response.statusCode);
  }
}
