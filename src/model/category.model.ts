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

  public foundNameNotId = async (name: string, id: string) => {
    try {
      const result = await this.builder
        .where("name", name)
        .whereNot("id", id)
        .whereNot("is_deleted", true)
        .select();
      if (!result.length) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };
}
