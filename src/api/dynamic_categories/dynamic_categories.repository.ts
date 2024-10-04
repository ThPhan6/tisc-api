import DynamicCategoryModel from "@/models/dynamic_category.model";
import BaseRepository from "@/repositories/base.repository";
import { DynamicCategory } from "@/types";

class DynamicCategoryRepository extends BaseRepository<DynamicCategory> {
  protected model: DynamicCategoryModel;
  protected DEFAULT_ATTRIBUTE: Partial<DynamicCategory> = {
    name: "",
  };
  constructor() {
    super();
    this.model = new DynamicCategoryModel();
  }
}

export default new DynamicCategoryRepository();
export const dynamicCategoryRepository = new DynamicCategoryRepository();
