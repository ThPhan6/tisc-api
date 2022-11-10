import { CustomProductAttribute } from "./custom_product.type";
import Model from "@/Database/Model";

export default class CustomProductModel extends Model<CustomProductAttribute> {
  protected table = "custom_products";
  protected softDelete = true;
}
