import Model from "@/Database/Model";
import { WarehouseLedgerEntity } from "@/types";

export default class WarehouseLedgerModel extends Model<WarehouseLedgerEntity> {
  protected table = "warehouse_ledgers";
  protected softDelete = true;
}
