import { Request, ResponseToolkit } from "@hapi/hapi";
import ProductTipService from "./product_tip.service";
import { IProductTipRequest } from "./product_tip.type";

export default class ProductTipController {
  private service: ProductTipService;
  constructor() {
    this.service = new ProductTipService();
  }

  public create = async (
    req: Request & { payload: IProductTipRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const response = await this.service.getList();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getById = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IProductTipRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getTipsByProductId = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await this.service.getTipsByProductId(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
