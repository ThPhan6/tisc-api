import { Request, ResponseToolkit } from "@hapi/hapi";
import ProductService from "./product.service";
import { ICategoryRequest } from "./product.type";
export default class ProductController {
  private service: ProductService;
  constructor() {
    this.service = new ProductService();
  }

  public create = async (
    req: Request & { payload: ICategoryRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.createCateogry(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getListCategory = async (req: Request, toolkit: ResponseToolkit) => {
    const { filter, limit, offset, sort } = req.query;
    const response = await this.service.getCategories(
      filter,
      limit,
      offset,
      sort
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
