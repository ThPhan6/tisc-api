import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { invoiceService } from "./invoice.service";
import { InvoiceRequestCreate, InvoiceRequestUpdate } from "./invoice.type";

export default class InvoiceController {
  public async create(
    req: Request & { payload: InvoiceRequestCreate },
    toolkit: ResponseToolkit
  ) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await invoiceService.create(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async update(
    req: Request & { payload: InvoiceRequestUpdate },
    toolkit: ResponseToolkit
  ) {
    const { id } = req.params;
    const payload = req.payload;
    const response = await invoiceService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async getList(req: Request, toolkit: ResponseToolkit) {
    const { limit, offset, sort, order } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await invoiceService.getList(limit, offset, sort, order);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
  public async get(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;
    const response = await invoiceService.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
