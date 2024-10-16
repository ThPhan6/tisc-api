import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { inventoryService } from "./inventory.service";
import { InventoryCreate } from "./inventory.type";

export default class InventoryController {
  public async get(req: Request, toolkit: ResponseToolkit) {
    const response = await inventoryService.get(req.params.id);
    return toolkit.response(response).code(response.statusCode);
  }

  public async getByCategory(req: Request, toolkit: ResponseToolkit) {
    const response = await inventoryService.getByCategoryId(req.params.id);
    return toolkit.response(response).code(response.statusCode);
  }

  public async create(
    req: Request & { payload: InventoryCreate },
    toolkit: ResponseToolkit
  ) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await inventoryService.create(user, payload);
    return toolkit.response(response).code(response.statusCode);
  }

  public async update(
    req: Request & { payload: InventoryCreate },
    toolkit: ResponseToolkit
  ) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await inventoryService.update(
      user,
      req.params.id,
      payload
    );
    return toolkit.response(response).code(response.statusCode);
  }

  public async delete(req: Request, toolkit: ResponseToolkit) {
    const response = await inventoryService.delete(req.params.id);
    return toolkit.response(response).code(response.statusCode);
  }
}
