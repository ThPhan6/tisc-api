import BrandService from "./brand.service";
import { Request, ResponseToolkit } from "@hapi/hapi";

export default class BrandController {
  private service: BrandService;
  constructor() {
    this.service = new BrandService();
  }
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset } = req.query;
    const response = await this.service.getList(limit, offset);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
