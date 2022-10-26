import { brandService } from "./brand.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IBrandRequest, IUpdateBrandProfileRequest } from "./brand.type";
import { BRAND_STATUS_OPTIONS } from "@/constants";
import { ActiveStatus, UserAttributes } from "@/types";

export default class BrandController {

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, order } = req.query;
    const response = await brandService.getList(
      limit,
      offset,
      filter,
      sort,
      order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getListCard = async (req: Request, toolkit: ResponseToolkit) => {
    const { filter, sort } = req.query;
    const response = await brandService.getListCard(filter, sort);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await brandService.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getAllBrandSummary = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    const response = await brandService.getBrandsSummary();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public invite = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;

    const response = await brandService.invite(user, id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getAllByAlphabet = async (_req: Request, toolkit: ResponseToolkit) => {
    const response = await brandService.getAllByAlphabet();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getBrandStatuses = async (_req: Request, toolkit: ResponseToolkit) => {
    return toolkit.response(BRAND_STATUS_OPTIONS).code(200);
  };

  public updateBrandProfile = async (
    req: Request & { payload: IUpdateBrandProfileRequest },
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const payload = req.payload;
    const response = await brandService.updateBrandProfile(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public updateBrandLogo = async (
    req: Request & { payload: { logo: any } },
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const logo = req.payload.logo;
    const response = await brandService.updateLogo(user, logo);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public create = async (
    req: Request & { payload: IBrandRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await brandService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public updateBrandStatus = async (
    req: Request & { payload: { status: ActiveStatus } },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await brandService.updateBrandStatus(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
