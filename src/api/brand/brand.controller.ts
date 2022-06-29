import BrandService from "./brand.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { BRAND_STATUS_OPTIONS } from "../../constant/common.constant";
import { IUpdateBrandProfileRequest } from "./brand.type";

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
  public getListCard = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort_name, sort_order } = req.query;
    const response = await this.service.getListCard(
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
  public updateBrandProfile = async (
    req: Request & { payload: IUpdateBrandProfileRequest },
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const payload = req.payload;
    const response = await this.service.updateBrandProfile(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateBrandLogo = async (
    req: Request & { payload: { logo: any } },
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const logo = req.payload.logo;
    const response = await this.service.updateLogo(userId, logo);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
