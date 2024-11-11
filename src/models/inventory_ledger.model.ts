import Model from "@/Database/Model";
import { InventoryLedgerEntity } from "@/types";

export default class InventoryLedgerModel extends Model<InventoryLedgerEntity> {
  protected table = "inventory_ledgers";
  protected softDelete = true;
}
