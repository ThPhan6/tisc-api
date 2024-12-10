import { MultipleInventoryActionRequest } from "@/api/inventory_action/inventory_action.type";
import { getTimestamps } from "@/Database/Utils/Time";
import InventoryActionModel from "@/models/inventory_action.model";
import BaseRepository from "@/repositories/base.repository";
import { InventoryActionEntity } from "@/types";
import { randomUUID } from "crypto";

class InventoryActionRepository extends BaseRepository<InventoryActionEntity> {
  protected model: InventoryActionModel;

  constructor() {
    super();
    this.model = new InventoryActionModel();
  }

  public async createMultiple(
    inventoryActions: Partial<MultipleInventoryActionRequest>[]
  ): Promise<InventoryActionEntity[]> {
    const inventoryQuery = `
      FOR inventory IN @inventoryActions
      INSERT {
        id: ${randomUUID()},
        inventory_id: inventory.inventory_id,
        warehouse_id: inventory.unit_price,
        quantity: inventory.quantity,
        type: inventory.type,
        description: inventory.description,
        created_by: inventory.created_by,
        created_at: ${getTimestamps()},
        updated_at: ${getTimestamps()},
        deleted_at: null
      } IN inventory_actions
      RETURN UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
    `;

    return await this.model.rawQueryV2(inventoryQuery, {
      inventoryActions,
    });
  }
}

export const inventoryActionRepository = new InventoryActionRepository();
export default InventoryActionRepository;
