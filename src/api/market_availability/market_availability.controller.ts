import { Request, ResponseToolkit } from "@hapi/hapi";
import Service from "./market_availability.service";
import { IUpdateMarketAvailabilityRequest } from "./market_availability.type";
export default class MarketAvailabilityController {
  private service: Service;
  constructor() {
    this.service = new Service();
  }
  public update = async (
    req: Request & { payload: IUpdateMarketAvailabilityRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, brand_id } = req.query;
    const response = await this.service.getList(
      brand_id,
      limit,
      offset,
      filter,
      sort
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getMarketAvailabilityGroupByCollection = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.query;
    const response = await this.service.getMarketAvailabilityGroupByCollection(
      brand_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
