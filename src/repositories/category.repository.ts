import { ICategoryAttributes } from "@/types/category.type";
import CategoryModel from "@/model/category.models";
import BaseRepository from "./base.repository";

class CategoryRepository extends BaseRepository<ICategoryAttributes> {
  protected model: CategoryModel;
  protected DEFAULT_ATTRIBUTE: Partial<ICategoryAttributes> = {
    name: "",
    subs: [],
    created_at: "",
  };
  constructor() {
    super();
    this.model = new CategoryModel();
  }
  public getDuplicatedCategory = async (id: string, name: string) => {
    try {
      const result: any = await this.model
        .where("id", "!=", id)
        .where("name", "==", name.toLowerCase())
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}

export default CategoryRepository;
