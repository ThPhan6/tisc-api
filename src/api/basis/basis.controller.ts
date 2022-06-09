import { Request, ResponseToolkit } from "@hapi/hapi";
import BasisService from "./basis.service";
import {
  IBasisConversionRequest,
  IBasisOptionRequest,
  IUpdateBasisOptionRequest,
} from "./basis.type";
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

  public getBasisConversions = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const {
      limit,
      offset,
      filter,
      conversion_group_order,
      conversion_between_order,
    } = req.query;
    const response = await this.service.getBasisConversions(
      limit,
      offset,
      filter,
      conversion_group_order,
      conversion_between_order
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

  public deleteBasis = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.deleteBasis(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public createBasisOption = async (
    req: Request & { payload: IBasisOptionRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.createBasisOption(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getBasisOption = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getBasisOption(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListBasisOption = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { limit, offset, filter, group_order, option_order } = req.query;
    const response = await this.service.getListBasisOption(
      limit,
      offset,
      filter,
      group_order,
      option_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateBasisOption = async (
    req: Request & { payload: IUpdateBasisOptionRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const { id } = req.params;
    const response = await this.service.updateBasisOption(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
