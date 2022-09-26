import { Request, ResponseToolkit } from "@hapi/hapi";
import MarketAvailabilityServices from "./market_availability.services";
import { IUpdateMarketAvailabilityRequest } from "./market_availability.type";
export default class MarketAvailabilityController {
  constructor() {}
  public update = async (
    req: Request & { payload: IUpdateMarketAvailabilityRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await MarketAvailabilityServices.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await MarketAvailabilityServices.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, brand_id } = req.query;
    const response = await MarketAvailabilityServices.getList(
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
    const { brand_id } = req.params;
    const response =
      await MarketAvailabilityServices.getMarketAvailabilityGroupByCollection(
        brand_id
      );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
