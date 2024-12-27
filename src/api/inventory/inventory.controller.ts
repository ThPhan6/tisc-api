import { Request, ResponseToolkit } from "@hapi/hapi";
import { ExchangeCurrencyRequest } from "../exchange_history/exchange_history.type";
import { inventoryService } from "./inventory.service";
import {
  ExportResponse,
  InventoryCategoryQuery,
  InventoryCreate,
  InventoryExportRequest,
  InventoryExportType,
  InventoryListRequest,
} from "./inventory.type";
import { UserAttributes } from "@/types";
import { convertISOToRandomText } from "@/helpers/common.helper";

export default class InventoryController {
  public async get(req: Request, toolkit: ResponseToolkit) {
    const response = await inventoryService.get(req.params.id);
    return toolkit.response(response).code(response.statusCode);
  }

  public async getList(req: Request, toolkit: ResponseToolkit) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await inventoryService.getList(
      user,
      req.query as InventoryCategoryQuery
    );
    return toolkit.response(response).code(response.statusCode);
  }

  public async getSummary(req: Request, toolkit: ResponseToolkit) {
    const response = await inventoryService.getSummary(req.params.id);
    return toolkit.response(response).code(response.statusCode);
  }

  public async create(
    req: Request & { payload: InventoryCreate },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await inventoryService.create(user, req.payload);
    return toolkit.response(response).code(response.statusCode);
  }

  public async update(
    req: Request & { payload: InventoryCreate },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await inventoryService.update(
      user,
      req.params.id,
      req.payload
    );
    return toolkit.response(response).code(response.statusCode);
  }
  public async updateInventories(
    req: Request & { payload: Record<string, InventoryListRequest> },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await inventoryService.updateInventories(
      user,
      req.payload
    );
    return toolkit.response(response).code(response.statusCode);
  }

  public async exchange(
    req: Request & { payload: Pick<ExchangeCurrencyRequest, "to_currency"> },
    toolkit: ResponseToolkit
  ) {
    const response = await inventoryService.exchange({
      relation_id: req.params.id,
      to_currency: req.payload.to_currency,
    });
    return toolkit.response(response).code(response.statusCode);
  }

  public async delete(req: Request, toolkit: ResponseToolkit) {
    const response = await inventoryService.delete(req.params.id);
    return toolkit.response(response).code(response.statusCode);
  }

  public async move(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;
    const { categoryId } = req.payload as any;
    const response = await inventoryService.move(id, categoryId);
    return toolkit.response(response).code(response.statusCode);
  }

  public async export(
    req: Request & { payload: InventoryExportRequest },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = (await inventoryService.export(
      user,
      req.payload
    )) as ExportResponse;

    return toolkit
      .response(response.data)
      .type("text/csv")
      .header(
        "Content-Disposition",
        `attachment; filename="${response.brand_name}-${
          response.category_name
        }-${convertISOToRandomText(new Date().toISOString())}.csv";`
      )
      .code(response.statusCode);
  }

  public async import(
    req: Request & { payload: InventoryCreate[] },
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await inventoryService.import(user, req.payload);
    return toolkit.response(response).code(response.statusCode);
  }
}
