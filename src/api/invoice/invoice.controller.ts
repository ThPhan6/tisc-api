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
  public async bill(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await invoiceService.bill(user, id);
    return toolkit.response(response).code(response.statusCode);
  }
  public async paid(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await invoiceService.paid(user, id);
    return toolkit.response(response).code(response.statusCode);
  }
  public async sendReminder(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await invoiceService.sendReminder(id, user);
    return toolkit.response(response).code(response.statusCode);
  }
  public async delete(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;
    const response = await invoiceService.delete(id);
    return toolkit.response(response).code(response.statusCode);
  }
  public async getInvoicePdf(req: Request, toolkit: ResponseToolkit) {
    const { id } = req.params;
    const response: any = await invoiceService.getInvoicePdf(id);
    const filename = `${response.fileName}.pdf`;

    return toolkit
      .response(response.data)
      .header("Content-Disposition", `attachment; filename=${filename}`)
      .header("Content-Type", "application/pdf");
  }
}
