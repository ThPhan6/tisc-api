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
}
