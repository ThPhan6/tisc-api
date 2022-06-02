import { ICategoryAttributes } from "../api/product/product.type";
import Model from "./index";

export const CATEGORY_NULL_ATTRIBUTES = {
  id: null,
  type: null,
  name: null,
  parent_id: null,
  created_at: null,
  is_deleted: false,
};

export default class CategoryModel extends Model<ICategoryAttributes> {
  constructor() {
    super("categories");
  }
  public getSubCategory = async (parent_id: any) => {
    try {
      let result;
      if (parent_id) {
        result = await this.builder.where("parent_id", parent_id).select();
      } else {
        result = [];
      }
      return result;
    } catch (error) {
      return false;
    }
  };
}
