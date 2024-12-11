import {
  MultipleWarehouseRequest,
  MultipleWarehouseResponse,
} from "@/api/warehouses/warehouse.type";
import { getTimestamps } from "@/Database/Utils/Time";
import WarehouseModel from "@/models/warehouse.model";
import BaseRepository from "@/repositories/base.repository";
import { WarehouseEntity, WarehouseStatus, WarehouseType } from "@/types";
import { randomUUID } from "crypto";

class WarehouseRepository extends BaseRepository<WarehouseEntity> {
  protected model: WarehouseModel;

  constructor() {
    super();
    this.model = new WarehouseModel();
  }

  public async getAllNonPhysicalWarehousesByParentId(
    parentId: string
  ): Promise<WarehouseEntity[]> {
    return await this.model
      .where("deleted_at", "==", null)
      .where("parent_id", "==", parentId)
      .where("type", "!=", WarehouseType.PHYSICAL)
      .get();
  }

  public async updateMultiple(
    warehouses: Partial<MultipleWarehouseRequest>[]
  ): Promise<MultipleWarehouseResponse[]> {
    const warehouseQuery = `
      FOR warehouse IN @warehouses
      LET target = FIRST(
        FOR ws IN warehouses
        FILTER ws.deleted_at == null
        FILTER ws.id == warehouse.id
        RETURN ws
      )
      UPDATE target._key WITH {
        status: HAS(warehouse, 'status') ? warehouse.status :  target.status,
        updated_at: "${getTimestamps()}",
        deleted_at: null
      } IN warehouses
      RETURN {
        before: UNSET(OLD, ['_key', '_id', '_rev', 'deleted_at']),
        after: UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
      }
    `;

    return await this.model.rawQueryV2(warehouseQuery, {
      warehouses,
    });
  }

  public async createMultiple(
    warehouses: Partial<MultipleWarehouseRequest>[]
  ): Promise<WarehouseEntity[]> {
    const warehouseQuery = `
      FOR warehouse IN @warehouses
      INSERT {
        id: warehouse.id,
        name: warehouse.name,
        type: warehouse.type,
        status: warehouse.status,
        parent_id: warehouse.parent_id,
        location_id: warehouse.location_id,
        relation_id: warehouse.relation_id,
        created_at: "${getTimestamps()}",
        updated_at: "${getTimestamps()}",
        deleted_at: null
      } IN warehouses
      RETURN UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
    `;

    return await this.model.rawQueryV2(warehouseQuery, {
      warehouses,
    });
  }
}

export const warehouseRepository = new WarehouseRepository();
export default WarehouseRepository;
