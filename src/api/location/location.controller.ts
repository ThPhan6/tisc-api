import { Request, ResponseToolkit } from "@hapi/hapi";
import LocationService from "./location.service";
export default class LocationController {
  private service: LocationService;
  constructor() {
    this.service = new LocationService();
  }
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getAllCountry = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getAllCountry();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getStates = async (req: Request, toolkit: ResponseToolkit) => {
    const { country_id } = req.params;
    const response = await this.service.getStates(country_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getCities = async (req: Request, toolkit: ResponseToolkit) => {
    const { country_id } = req.params;
    const response = await this.service.getCities(country_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
