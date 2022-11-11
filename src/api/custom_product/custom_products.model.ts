import { CustomProductAttributes } from "./custom_product.type";
import Model from "@/Database/Model";

export default class CustomProductModel extends Model<CustomProductAttributes> {
  protected table = "custom_products";
  protected softDelete = true;
}
