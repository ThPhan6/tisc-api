import { Request, ResponseToolkit } from "@hapi/hapi";
import ProductService from "./product.service";
import { ICategoryRequest } from "./product.type";
export default class ProductController {
  private service: ProductService;
  constructor() {
    this.service = new ProductService();
  }

  public createCategory = async (
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
  public getByIdCategory = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getByIdCategory(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public updateCategory = async (
    req: Request & { payload: ICategoryRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.updateCategory(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
