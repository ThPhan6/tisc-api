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
