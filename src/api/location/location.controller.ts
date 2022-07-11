import { Request, ResponseToolkit } from "@hapi/hapi";
import LocationService from "./location.service";
import { ILocationRequest } from "./location.type";
export default class LocationController {
  private service: LocationService;
  constructor() {
    this.service = new LocationService();
  }
  public create = async (
    req: Request & { payload: ILocationRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: ILocationRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.update(userId, id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getAllCountry = async (req: Request, toolkit: ResponseToolkit) => {
    const response = await this.service.getAllCountry();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getStates = async (req: Request, toolkit: ResponseToolkit) => {
    const { country_id } = req.query;
    const response = await this.service.getStates(country_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getCities = async (req: Request, toolkit: ResponseToolkit) => {
    const { country_id, state_id } = req.query;
    const response = await this.service.getCities(country_id, state_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getCountry = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getCountry(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getState = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getState(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getCity = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getCity(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, order } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getList(
      userId,
      limit,
      offset,
      filter,
      sort,
      order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListWithGroup = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getListWithGroup(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.delete(userId, id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getFunctionalTypes = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    const response = await this.service.getFunctionalTypes();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
