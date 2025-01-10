import Model from "@/Database/Model";
import { InventoryEntity } from "@/types";

export default class InventoryModel extends Model<InventoryEntity> {
  protected table = "inventories";
  protected softDelete = true;
}
