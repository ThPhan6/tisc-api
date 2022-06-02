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
}
