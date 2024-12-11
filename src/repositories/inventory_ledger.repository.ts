import {
  MultipleInventoryLedgerRequest,
  MultipleInventoryLedgerResponse,
} from "@/api/inventory_ledger/inventory_ledger.type";
import { getTimestamps } from "@/Database/Utils/Time";
import { convertInStock } from "@/helpers/common.helper";
import InventoryLedgerModel from "@/models/inventory_ledger.model";
import BaseRepository from "@/repositories/base.repository";
import { InventoryLedgerEntity, WarehouseStatus, WarehouseType } from "@/types";
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
      LET warehouseInStockIds = (
        FOR warehouse IN warehouses
        FILTER warehouse.deleted_at == null
        FILTER warehouse.status == ${WarehouseStatus.ACTIVE}
        FILTER warehouse.type == ${WarehouseType.IN_STOCK}
        RETURN warehouse.id
      )

      LET ledgers = (
        FOR le IN inventory_ledgers
        FILTER le.deleted_at == null
        FILTER le.warehouse_id IN warehouseInStockIds
        RETURN le
      )

      FOR inventory IN @inventoryLedgers
      LET target = FIRST(
        FOR inven IN ledgers
        FILTER inven.deleted_at == null
        FILTER inven.inventory_id == inventory.inventory_id
        FILTER inven.warehouse_id == inventory.warehouse_id
        RETURN inven
      )
      UPDATE target._key WITH {
        quantity: TO_NUMBER(target.quantity) == TO_NUMBER(inventory.quantity) ? TO_NUMBER(target.quantity) + TO_NUMBER(inventory.convert) : TO_NUMBER(inventory.quantity) + TO_NUMBER(inventory.convert),
        status: ${WarehouseStatus.ACTIVE},
        updated_at: "${getTimestamps()}",
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
        id: "${randomUUID()}",
        inventory_id: inventory.inventory_id,
        warehouse_id: inventory.warehouse_id,
        quantity: TO_NUMBER(inventory.quantity) + TO_NUMBER(inventory.convert OR 0),
        status: ${WarehouseStatus.ACTIVE},
        created_at: "${getTimestamps()}",
        updated_at: "${getTimestamps()}",
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
