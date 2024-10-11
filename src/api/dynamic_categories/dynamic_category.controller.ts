import DynamicCategoryService from "@/api/dynamic_categories/dynamic_category.service";
import {
  CategoryEntity,
  DetailedCategoryEntity,
  UserAttributes,
} from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";

export default class DynamicCategoryController {
  public create = async (req: Request, toolkit: ResponseToolkit) => {
    const payload = req.payload as DetailedCategoryEntity;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await DynamicCategoryService.create(payload, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getCategoriesByRelationId = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await DynamicCategoryService.getCategoriesByRelationId(
      user
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const payload = req.payload as CategoryEntity;
    const response = await DynamicCategoryService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await DynamicCategoryService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public move = async (req: Request, toolkit: ResponseToolkit) => {
    const { sub_id } = req.params;
    const { parent_id } = req.payload as CategoryEntity;
    const response = await DynamicCategoryService.move(sub_id, parent_id ?? "");
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public groupCategories = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await DynamicCategoryService.groupCategories(user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
