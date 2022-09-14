import { Request, ResponseToolkit } from "@hapi/hapi";
import CategoryService from "./category.services";
import { ICategoryRequest } from "./category.type";
export default class CategoryController {
  private service: CategoryService;
  constructor() {
    this.service = new CategoryService();
  }

  public create = async (
    req: Request & { payload: ICategoryRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const {
      limit,
      offset,
      filter,
      main_category_order,
      sub_category_order,
      category_order,
    } = req.query;
    const response = await this.service.getList(
      limit,
      offset,
      filter,
      main_category_order,
      sub_category_order,
      category_order
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

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
