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
    const { limit, offset, filter, sort } = req.query;
    const response = await this.service.getCategories(
      limit,
      offset,
      filter,
      sort
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getById = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: ICategoryRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
