import { Request, ResponseToolkit } from "@hapi/hapi";
import DistributorService from "./distributor.services";
import { IDistributorRequest } from "./distributor.type";

export default class DistributorController {
  private service: DistributorService;
  constructor() {
    this.service = new DistributorService();
  }
  public create = async (
    req: Request & { payload: IDistributorRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, brand_id, sort, order, filter } = req.query;
    const response = await this.service.getList(
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
    const response = await this.service.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: IDistributorRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getDistributorGroupByCountry = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.query;
    const response = await this.service.getDistributorGroupByCountry(brand_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getMarketDistributorGroupByCountry = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { product_id } = req.params;
    const response = await this.service.getMarketDistributorGroupByCountry(
      product_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
