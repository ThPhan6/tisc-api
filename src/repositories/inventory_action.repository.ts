import { MultipleInventoryActionRequest } from "@/api/inventory_action/inventory_action.type";
import { getInventoryActionDescription } from "@/helpers/common.helper";
import InventoryActionModel from "@/models/inventory_action.model";
import BaseRepository from "@/repositories/base.repository";
import {
  InventoryActionDescription,
  InventoryActionEntity,
  InventoryActionType,
  WarehouseType,
} from "@/types";

class InventoryActionRepository extends BaseRepository<InventoryActionEntity> {
  protected model: InventoryActionModel;

  constructor() {
    super();
    this.model = new InventoryActionModel();
  }

  public async createMultiple(
    categoryId: string,
    inventoryActions: Partial<MultipleInventoryActionRequest>[]
  ): Promise<InventoryActionEntity[]> {
    const inventoryQuery = `
       LET ledgers = (
        FOR led IN inventory_ledgers
        FILTER led.deleted_at == null
        FILTER led.inventory_category_id == @categoryId
        FILTER led.type == ${WarehouseType.IN_STOCK}
        RETURN led
      )

      FOR inventory IN @inventoryActions
      LET ledger = FIRST(
        FOR led IN ledgers
        FILTER led.inventory_id == inventory.inventory_id
        FILTER led.warehouse_id == inventory.warehouse_id
        RETURN led
      )
      INSERT {
        id: inventory.id,
        inventory_id: inventory.inventory_id,
        warehouse_id: inventory.warehouse_id,
        quantity: inventory.quantity - ledger.quantity,
        type: inventory.quantity - ledger.quantity > 0 ? ${
          InventoryActionType.IN
        } : ${InventoryActionType.OUT},
        description: "${getInventoryActionDescription(
          InventoryActionDescription.ADJUST
        )}",
        created_by: inventory.created_by,
        created_at: inventory.created_at,
        updated_at: inventory.updated_at,
        deleted_at: null
      } IN inventory_actions
      RETURN true
    `;

    return await this.model.rawQueryV2(inventoryQuery, {
      inventoryActions,
      categoryId,
    });
  }
}

export const inventoryActionRepository = new InventoryActionRepository();
export default InventoryActionRepository;
