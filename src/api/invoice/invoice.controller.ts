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
    return toolkit.response(response).code(response.statusCode);
  }

  public async update(
    req: Request & { payload: InvoiceRequestUpdate },
    toolkit: ResponseToolkit
  ) {
    const { id } = req.params;
    const payload = req.payload;
    const response = await invoiceService.update(id, payload);
    return toolkit.response(response).code(response.statusCode);
  }

  public async getList(req: Request, toolkit: ResponseToolkit) {
    const { limit, offset, sort, order } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await invoiceService.getList(
      user,
      limit,
      offset,
      sort,
      order
    );
    return toolkit.response(response).code(response.statusCode);
  }

  public async getInvoiceSummary(_req: Request, toolkit: ResponseToolkit) {
    const response = await invoiceService.getInvoiceSummary();
    return toolkit.response(response).code(response.statusCode);
  }

  public async get(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await invoiceService.get(user, id);
    return toolkit.response(response).code(response.statusCode);
  }
  public async sendReminder(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;
    const response = await invoiceService.sendReminder(id);
    return toolkit.response(response).code(response.statusCode);
  }
}
