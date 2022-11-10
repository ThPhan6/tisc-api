import Model from "@/Database/Model";
import { CustomResouceAttribute } from "./custom_product.type";

export default class CustomResourceModel extends Model<CustomResouceAttribute> {
  protected table = "custom_resources";
  protected softDelete = true;
}
