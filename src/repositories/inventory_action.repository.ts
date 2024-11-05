import InventoryActionModel from "@/models/inventory_action.model";
import BaseRepository from "@/repositories/base.repository";
import { InventoryActionEntity } from "@/types";

class InventoryActionRepository extends BaseRepository<InventoryActionEntity> {
  protected model: InventoryActionModel;

  constructor() {
    super();
    this.model = new InventoryActionModel();
  }
}

export const inventoryActionRepository = new InventoryActionRepository();
export default InventoryActionRepository;
