import Model from "@/Database/Model";
import { InventoryActionEntity } from "@/types";

export default class InventoryActionModel extends Model<InventoryActionEntity> {
  protected table = "inventory_actions";
  protected softDelete = true;
}
