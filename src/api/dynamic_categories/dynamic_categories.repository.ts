import DynamicCategoryModel from "@/models/dynamic_category.model";
import BaseRepository from "@/repositories/base.repository";
import {
  CategoryEntity,
  CategoryTypeEnum,
  DetailedCategoryEntity,
} from "@/types";

class DynamicCategoryRepository extends BaseRepository<DetailedCategoryEntity> {
  protected model: DynamicCategoryModel;
  protected DEFAULT_ATTRIBUTE: Partial<CategoryEntity> = {
    name: "",
    parent_id: null,
    type: CategoryTypeEnum.Inventory,
    level: 1,
  };
  constructor() {
    super();
    this.model = new DynamicCategoryModel();
  }

  public getCategoriesByRelationId = async (relationId: string) => {
    return await this.model
      .getQuery()
      .where("relation_id", "==", relationId)
      .whereNull("deleted_at")
      .get();
  };
}

export default new DynamicCategoryRepository();
export const dynamicCategoryRepository = new DynamicCategoryRepository();
