import DynamicCategoryService from "@/api/dynamic_categories/dynamic_category.service";
import { DynamicCategory, UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";

export default class DynamicCategoryController {
  public create = async (req: Request, toolkit: ResponseToolkit) => {
    const payload = req.payload as DynamicCategory;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await DynamicCategoryService.create(payload, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getAll = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await DynamicCategoryService.getAll(user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const payload = req.payload as DynamicCategory;
    const response = await DynamicCategoryService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await DynamicCategoryService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public moveTo = async (req: Request, toolkit: ResponseToolkit) => {
    const { sub_category_id, category_id } = req.params;
    const response = await DynamicCategoryService.moveTo(
      category_id,
      sub_category_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
