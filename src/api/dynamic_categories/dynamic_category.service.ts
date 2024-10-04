import { mappingDynamicCategories } from "@/api/dynamic_categories/dynamic_categories.mapping";
import { dynamicCategoryRepository } from "@/api/dynamic_categories/dynamic_categories.repository";
import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { CategoryTypeEnum, DynamicCategory, UserAttributes } from "@/types";

class DynamicCategoryService {
  public async create(payload: DynamicCategory, user: UserAttributes) {
    const { name, parent_id } = payload;

    let level = 1;

    if (parent_id) {
      const parentItem = await dynamicCategoryRepository.findBy({
        id: parent_id,
      });

      if (!parentItem) return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);

      level = (parentItem as any)?.level + 1;
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

  public async getAll(user: UserAttributes) {
    const categories = await dynamicCategoryRepository.getAll();

    const mappedData = mappingDynamicCategories(categories, user.relation_id);

    return successResponse({ data: mappedData });
  }

  public async update(id: string, payload: DynamicCategory) {
    const category = await dynamicCategoryRepository.find(id);
    if (!category) return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);
    await dynamicCategoryRepository.update(id, { name: payload.name });
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async delete(id: string) {
    const category = await dynamicCategoryRepository.find(id);

    if (!category) return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);

    await dynamicCategoryRepository.delete(id);

    if (!category.parent_id)
      await dynamicCategoryRepository.deleteBy({ parent_id: id });

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async moveTo(category_id: string, sub_category_id: string) {
    const category = await dynamicCategoryRepository.find(category_id);

    const subCategory = await dynamicCategoryRepository.find(sub_category_id);

    if (!category || !subCategory)
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);

    await dynamicCategoryRepository.update(category_id, {
      parent_id: sub_category_id,
    });

    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export default new DynamicCategoryService();
