import { Request, ResponseToolkit } from "@hapi/hapi";
import { categoryService } from "./category.service";
import { ICategoryRequest } from "./category.type";

export default class CategoryController {
  public create = async (
    req: Request & { payload: ICategoryRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await categoryService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const {
      limit,
      offset,
      filter,
      sort,
      order,
      main_category_order,
      sub_category_order,
      category_order,
    } = req.query;
    const response = await categoryService.getList(
      limit,
      offset,
      filter,
      sort,
      order,
      main_category_order,
      sub_category_order,
      category_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getById = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await categoryService.getById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: ICategoryRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await categoryService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await categoryService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
