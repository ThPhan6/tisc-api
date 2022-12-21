import Model from "@/Database/Model";
import { CustomResouceAttributes } from "../custom_product/custom_product.type";

export default class CustomResourceModel extends Model<CustomResouceAttributes> {
  protected table = "custom_resources";
  protected softDelete = true;
}
