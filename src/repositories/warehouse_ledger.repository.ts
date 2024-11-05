import InventoryLedgerModel from "@/models/inventory_ledger.model";
import BaseRepository from "@/repositories/base.repository";
import { InventoryLedgerEntity } from "@/types";

class InventoryLedgerRepository extends BaseRepository<InventoryLedgerEntity> {
  protected model: InventoryLedgerModel;

  constructor() {
    super();
    this.model = new InventoryLedgerModel();
  }
}

export const inventoryLedgerRepository = new InventoryLedgerRepository();
export default InventoryLedgerRepository;
