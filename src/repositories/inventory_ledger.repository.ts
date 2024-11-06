import InventoryLedgerModel from "@/models/inventory_ledger.model";
import BaseRepository from "@/repositories/base.repository";
import { InventoryLedgerEntity, WarehouseStatus } from "@/types";
import { head } from "lodash";

class InventoryLedgerRepository extends BaseRepository<InventoryLedgerEntity> {
  protected model: InventoryLedgerModel;

  constructor() {
    super();
    this.model = new InventoryLedgerModel();
  }

  public async updateInventoryLedgerByWarehouseId(
    warehouseId: string
  ): Promise<InventoryLedgerEntity> {
    const ledgers = await this.model
      .where("deleted_at", "==", null)
      .where("warehouse_id", "==", warehouseId)
      .update({
        status: WarehouseStatus.INACTIVE,
        quantity: 0,
      });

    return head(ledgers);
  }
}

export const inventoryLedgerRepository = new InventoryLedgerRepository();
export default InventoryLedgerRepository;
