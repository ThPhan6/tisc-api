import Model from "@/Database/Model";
import { ICategoryAttributes } from "@/types/category.type";

export default class CategoryModel extends Model<ICategoryAttributes> {
  protected table = "categories";
  protected softDelete = true;
}
