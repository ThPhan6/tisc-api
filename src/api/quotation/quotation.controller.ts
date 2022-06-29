import { ResponseToolkit } from "@hapi/hapi";
import { IQuotationRequest } from "./quotation.type";

export default class QuotationController {
  private service: QuotationService;
  constructor() {
    this.service = new QuotationService();
  }

  public create = async (
    req: Request & { payload: IQuotationRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
