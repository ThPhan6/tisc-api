import { MultipleInventoryLedgerRequest } from "@/api/inventory_ledger/inventory_ledger.type";
import { getTimestamps } from "@/Database/Utils/Time";
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
  ): Promise<InventoryLedgerEntity[]> {
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
        FOR led IN ledgers
        FILTER led.inventory_id == inventory.inventory_id
        FILTER led.warehouse_id == inventory.warehouse_id
        RETURN led
      )
      UPDATE target._key WITH {
        quantity: TO_NUMBER(inventory.quantity),
        status: ${WarehouseStatus.ACTIVE},
        updated_at: inventory.updated_at,
        deleted_at: null
      } IN inventory_ledgers
      RETURN UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
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
        id: inventory.id,
        inventory_id: inventory.inventory_id,
        warehouse_id: inventory.warehouse_id,
        quantity: TO_NUMBER(inventory.quantity) + TO_NUMBER(inventory.convert OR 0),
        status: ${WarehouseStatus.ACTIVE},
        type: inventory.type,
        created_at: inventory.created_at,
        updated_at: inventory.updated_at",
        deleted_at: null
      } IN inventory_ledgers
      RETURN UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
    `;

    return await this.model.rawQueryV2(inventoryQuery, {
      inventoryLedgers,
    });
  }

  public findByInventories = async (inventoryIds: string[]) => {
    const query = `
     for ledger in inventory_ledgers
     filter ledger.deleted_at == null
     filter ledger.inventory_id in @inventoryIds
     filter ledger.status == ${WarehouseStatus.ACTIVE}
     filter ledger.type == ${WarehouseType.IN_STOCK}
     return ledger
    `;

    return this.model.rawQueryV2(query, {
      inventoryIds,
    });
  };

  public getByWarehouses = async (
    warehouseIds: string[],
    inventoryId: string
  ) => {
    const query = `
     for ledger in inventory_ledgers
     filter ledger.deleted_at == null
     filter ledger.warehouse_id in @warehouseIds
     filter ledger.inventory_id == @inventoryId
     filter ledger.status == ${WarehouseStatus.ACTIVE}
     filter ledger.type == ${WarehouseType.IN_STOCK}
     return ledger
    `;

    return this.model.rawQueryV2(query, {
      warehouseIds,
      inventoryId,
    }) as any;
  };
}

export const inventoryLedgerRepository = new InventoryLedgerRepository();
export default InventoryLedgerRepository;
