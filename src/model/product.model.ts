import { ICategoryAttributes } from "../api/product/product.type";
import Model from "./index";

export const CATEGORY_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  subs: null,
  type: null,
  created_at: null,
  is_deleted: false,
};

export default class CategoryModel extends Model<ICategoryAttributes> {
  constructor() {
    super("categories_basis_attributes");
  }
}
