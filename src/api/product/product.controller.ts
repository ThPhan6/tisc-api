import ProductService from "./product.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IProductRequest } from "./product.type";

export default class ProductController {
  private service: ProductService;
  constructor() {
    this.service = new ProductService();
  }
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset } = req.query;
    const response = await this.service.getList(limit, offset);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public create = async (
    req: Request & { payload: IProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getProductLeftInCollection = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await this.service.getProductLeftInCollection(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
