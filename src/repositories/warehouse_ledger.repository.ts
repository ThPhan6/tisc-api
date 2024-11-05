import WarehouseLedgerModel from "@/models/warehouse_ledger.model";
import BaseRepository from "@/repositories/base.repository";
import { WarehouseLedgerEntity } from "@/types";

class WarehouseLedgerRepository extends BaseRepository<WarehouseLedgerEntity> {
  protected model: WarehouseLedgerModel;

  constructor() {
    super();
    this.model = new WarehouseLedgerModel();
  }
}

export const warehouseLedgerRepository = new WarehouseLedgerRepository();
export default WarehouseLedgerRepository;
