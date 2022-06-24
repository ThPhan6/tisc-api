import BrandService from "./brand.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { BRAND_STATUS_OPTIONS } from "../../constant/common.constant";

export default class BrandController {
  private service: BrandService;
  constructor() {
    this.service = new BrandService();
  }
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort_name, sort_order } = req.query;
    const response = await this.service.getList(
      limit,
      offset,
      filter,
      sort_name,
      sort_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public invite = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.invite(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getAllByAlphabet = async (_req: Request, toolkit: ResponseToolkit) => {
    const response = await this.service.getAllByAlphabet();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getBrandStatuses = async (_req: Request, toolkit: ResponseToolkit) => {
    return toolkit.response(BRAND_STATUS_OPTIONS).code(200);
  };
}
