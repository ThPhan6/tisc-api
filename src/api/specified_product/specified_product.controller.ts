import SpecifiedProductService from "./specified_product.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { ISpecifiedProductRequest } from "./specified_product.type";

export default class SpecifiedProductController {
  private service: SpecifiedProductService;
  constructor() {
    this.service = new SpecifiedProductService();
  }
  public specify = async (
    req: Request & { payload: ISpecifiedProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.specify(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { considered_product_id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.get(userId, considered_product_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListByBrand = async (req: Request, toolkit: ResponseToolkit) => {
    const { project_id } = req.params;
    const { brand_order } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getListByBrand(
      userId,
      project_id,
      brand_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListByMaterial = async (req: Request, toolkit: ResponseToolkit) => {
    const { project_id } = req.params;
    const { brand_order, material_order } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getListByMaterial(
      userId,
      project_id,
      brand_order,
      material_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListByZone = async (req: Request, toolkit: ResponseToolkit) => {
    const { project_id } = req.params;
    const { brand_order, zone_order, area_order, room_order } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getListByZone(
      userId,
      project_id,
      zone_order,
      area_order,
      room_order,
      brand_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getRequirementTypes = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getRequirementTypes(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getInstructionTypes = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getInstructionTypes(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getUnitTypes = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getUnitTypes(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
