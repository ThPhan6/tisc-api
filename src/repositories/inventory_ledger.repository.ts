import {
  MultipleInventoryLedgerRequest,
  MultipleInventoryLedgerResponse,
} from "@/api/inventory_ledger/inventory_ledger.type";
import { getTimestamps } from "@/Database/Utils/Time";
import InventoryLedgerModel from "@/models/inventory_ledger.model";
import BaseRepository from "@/repositories/base.repository";
import { InventoryLedgerEntity } from "@/types";
import { randomUUID } from "crypto";
import { head } from "lodash";

class InventoryLedgerRepository extends BaseRepository<InventoryLedgerEntity> {
  protected model: InventoryLedgerModel;

  constructor() {
    super();
    this.model = new InventoryLedgerModel();
  }

  public async updateInventoryLedgerByWarehouseId(
    warehouseId: string,
    payload: Partial<InventoryLedgerEntity>
  ): Promise<InventoryLedgerEntity | undefined> {
    const ledgers = await this.model
      .where("deleted_at", "==", null)
      .where("warehouse_id", "==", warehouseId)
      .update(payload);

    return head(ledgers);
  }

  public async updateMultiple(
    inventoryLedgers: Partial<MultipleInventoryLedgerRequest>[]
  ): Promise<MultipleInventoryLedgerResponse[]> {
    const inventoryQuery = `
      FOR inventory IN @inventoryLedgers
      LET target = FIRST(FOR inven IN inventory_ledgers FILTER inven.deleted_at == null FILTER inven.id == inventory.id RETURN inven)
      INSERT {
        id: target.id,
        inventory_id: target.inventory_id,
        warehouse_id: target.warehouse_id,
        quantity: inventory.quantity,
        status: inventory.status,
        created_at: target.created_at,
        updated_at: ${getTimestamps()},
        deleted_at: null
      } IN inventory_ledgers
      RETURN {
        before: UNSET(OLD, ['_key', '_id', '_rev', 'deleted_at']),
        after: UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
      }
    `;

    return await this.model.rawQueryV2(inventoryQuery, {
      inventoryLedgers,
    });
  }

  public async createMultiple(
    inventoryLedgers: Partial<MultipleInventoryLedgerRequest>[]
  ): Promise<InventoryLedgerEntity[]> {
    const inventoryQuery = `
      FOR inventory IN @inventoryLedgers
      INSERT {
        id: ${randomUUID()},
        inventory_id: inventory.inventory_id,
        warehouse_id: inventory.warehouse_id,
        quantity: inventory.quantity,
        status: inventory.status,
        created_at: ${getTimestamps()},
        updated_at: ${getTimestamps()},
        deleted_at: null
      } IN inventory_ledgers
      RETURN UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
    `;

    return await this.model.rawQueryV2(inventoryQuery, {
      inventoryLedgers,
    });
  }
}

export const inventoryLedgerRepository = new InventoryLedgerRepository();
export default InventoryLedgerRepository;
