import { ICategoryAttributes } from "../api/category/category.type";
import Model from "./index";

export const CATEGORY_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  subs: null,
  created_at: null,
  is_deleted: false,
};

export default class CategoryModel extends Model<ICategoryAttributes> {
  constructor() {
    super("categories");
  }

  public getDuplicatedCategory = async (id: string, name: string) => {
    try {
      const result: any = await this.builder
        .whereNot("id", id)
        .whereNot("is_deleted", true)
        .where("name", name.toLowerCase())
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}
