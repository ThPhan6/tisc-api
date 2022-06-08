import { Request, ResponseToolkit } from "@hapi/hapi";
import BasisService from "./basis.service";
import { IBasisConversionRequest } from "./basis.type";
export default class BasisController {
  private service: BasisService;
  constructor() {
    this.service = new BasisService();
  }

  public createBasisConversion = async (
    req: Request & { payload: IBasisConversionRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.createBasisConversion(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getBasesConversion = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { limit, offset, filter, sort } = req.query;
    const response = await this.service.getBasesConversion(
      limit,
      offset,
      filter,
      sort
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getBasisConversionById = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await this.service.getBasisConversionById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public updateBasisConversion = async (
    req: Request & { payload: IBasisConversionRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.updateBasisConversion(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public deleteBasisConversion = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await this.service.deleteBasisConversion(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
