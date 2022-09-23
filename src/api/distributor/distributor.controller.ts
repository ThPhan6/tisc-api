import { Request, ResponseToolkit } from "@hapi/hapi";
import DistributorService from "./distributor.services";
import { IDistributorRequest } from "./distributor.type";

export default class DistributorController {
  constructor() {}
  public create = async (
    req: Request & { payload: IDistributorRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await DistributorService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await DistributorService.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, brand_id, sort, order, filter } = req.query;
    const response = await DistributorService.getList(
      brand_id,
      limit,
      offset,
      filter,
      sort,
      order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await DistributorService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: IDistributorRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await DistributorService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getDistributorGroupByCountry = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.query;
    const response = await DistributorService.getDistributorGroupByCountry(
      brand_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getMarketDistributorGroupByCountry = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { product_id } = req.params;
    const response =
      await DistributorService.getMarketDistributorGroupByCountry(product_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
