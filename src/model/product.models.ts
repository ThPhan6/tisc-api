import Model from "@/Database/Model";
import { IProductAttributes } from "@/types/product.type";

export default class ProductModel extends Model<IProductAttributes> {
  protected table = "products";
  protected softDelete = true;
}
