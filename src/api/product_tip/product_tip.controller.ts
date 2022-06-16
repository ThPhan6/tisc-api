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
}
