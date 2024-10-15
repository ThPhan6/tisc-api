import { mappingDynamicCategories } from "@/api/dynamic_categories/dynamic_categories.mapping";
import { dynamicCategoryRepository } from "@/api/dynamic_categories/dynamic_categories.repository";
import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import {
  CategoryTypeEnum,
  CategoryEntity,
  UserAttributes,
  DetailedCategoryEntity,
} from "@/types";
import { filter, isEmpty } from "lodash";

class DynamicCategoryService {
  public async create(payload: DetailedCategoryEntity, user: UserAttributes) {
    const { name, level, parent_id } = payload;

    if (parent_id) {
      const parentItem = await dynamicCategoryRepository.findBy({
        id: parent_id,
      });
      if (!parentItem) return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);
    }

    const newItem = await dynamicCategoryRepository.create({
      name,
      parent_id: parent_id || null,
      type: CategoryTypeEnum.Inventory,
      level,
      relation_id: user.relation_id,
    });

    return successResponse({ data: newItem });
  }

  public async getCategoriesByRelationId(user: UserAttributes) {
    const data = await dynamicCategoryRepository.getCategoriesByRelationId(
      user.relation_id
    );
    return successResponse({ data });
  }

  public async update(id: string, payload: CategoryEntity) {
    const category = await dynamicCategoryRepository.find(id);
    if (!category) return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);
    await dynamicCategoryRepository.update(id, { name: payload.name });
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async delete(id: string) {
    const category = await dynamicCategoryRepository.find(id);

    if (!category) return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);

    const categories =
      await dynamicCategoryRepository.getCategoriesByRelationId(
        category.relation_id
      );

    const descendantIds = this.getDescendants(categories, id);

    const ids = [id, ...descendantIds];

    await dynamicCategoryRepository.deleteMany(ids);

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async move(sub_id: string, parent_id: string) {
    const category = await dynamicCategoryRepository.find(sub_id);

    const subCategory = await dynamicCategoryRepository.find(parent_id);

    if (!category || !subCategory)
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);

    await dynamicCategoryRepository.update(sub_id, {
      parent_id: parent_id,
    });

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  private getDescendants(items: DetailedCategoryEntity[], parent_id: string) {
    const descendantIds = [];
    const stack = [parent_id];

    while (stack.length > 0) {
      const currentId = stack.pop();
      const children = items.filter((item) => item.parent_id === currentId);

      for (const child of children) {
        descendantIds.push(child.id);
        stack.push(child.id);
      }
    }

    return descendantIds;
  }

  public async groupCategories(user: UserAttributes) {
    const categories = await dynamicCategoryRepository.getAll();
    const mappedData = mappingDynamicCategories(categories, user.relation_id);
    return successResponse({ data: mappedData });
  }
}

export default new DynamicCategoryService();
