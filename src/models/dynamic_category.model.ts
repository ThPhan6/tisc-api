import Model from "@/Database/Model";
import { DynamicCategory } from "@/types";

export default class DynamicCategoryModel extends Model<DynamicCategory> {
  protected table = "dynamic_categories";
  protected softDelete = true;
}
