import { Request, ResponseToolkit } from "@hapi/hapi";
import {quotationService} from "./quotation.service";
import { IQuotationRequest } from "./quotation.type";

export default class QuotationController {


  public create = async (
    req: Request & { payload: IQuotationRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await quotationService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort } = req.query;
    const response = await quotationService.getList(limit, offset, filter, sort);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await quotationService.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IQuotationRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await quotationService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await quotationService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
