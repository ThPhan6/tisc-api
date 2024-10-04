import Model from "@/Database/Model";
import { DetailedCategoryEntity } from "@/types";

export default class DynamicCategoryModel extends Model<DetailedCategoryEntity> {
  protected table = "dynamic_categories";
  protected softDelete = true;
}
