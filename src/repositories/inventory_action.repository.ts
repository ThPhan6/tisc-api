import { MultipleInventoryActionRequest } from "@/api/inventory_action/inventory_action.type";
import { getTimestamps } from "@/Database/Utils/Time";
import { getInventoryActionDescription } from "@/helpers/common.helper";
import InventoryActionModel from "@/models/inventory_action.model";
import BaseRepository from "@/repositories/base.repository";
import {
  InventoryActionDescription,
  InventoryActionEntity,
  InventoryActionType,
  WarehouseStatus,
  WarehouseType,
} from "@/types";
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
      LET warehouseInStockIds = (
        FOR warehouse IN warehouses
        FILTER warehouse.deleted_at == null
        FILTER warehouse.status == ${WarehouseStatus.ACTIVE}
        FILTER warehouse.type == ${WarehouseType.IN_STOCK}
        RETURN warehouse.id
      )

      LET ledgers = (
        FOR led IN inventory_ledgers
        FILTER led.deleted_at == null
        FILTER led.warehouse_id IN warehouseInStockIds
        RETURN led
      )

      FOR inventory IN @inventoryActions
      LET ledger = FIRST(
        FOR led IN ledgers
        FILTER led.deleted_at == null
        FILTER led.inventory_id == inventory.inventory_id
        FILTER led.warehouse_id == inventory.warehouse_id
        RETURN led
      )
      INSERT {
        id: "${randomUUID()}",
        inventory_id: inventory.inventory_id,
        warehouse_id: inventory.warehouse_id,
        quantity: TO_NUMBER(inventory.quantity) - TO_NUMBER(ledger.quantity),
        type: TO_NUMBER(inventory.quantity) - TO_NUMBER(ledger.quantity) > 0 ? ${
          InventoryActionType.IN
        } : ${InventoryActionType.OUT},
        description: "${getInventoryActionDescription(
          InventoryActionDescription.ADJUST
        )}",
        created_by: inventory.created_by,
        created_at: "${getTimestamps()}",
        updated_at: "${getTimestamps()}",
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
