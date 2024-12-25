import { MultipleWarehouseRequest } from "@/api/warehouses/warehouse.type";
import WarehouseModel from "@/models/warehouse.model";
import BaseRepository from "@/repositories/base.repository";
import { WarehouseEntity, WarehouseStatus, WarehouseType } from "@/types";

class WarehouseRepository extends BaseRepository<WarehouseEntity> {
  protected model: WarehouseModel;

  constructor() {
    super();
    this.model = new WarehouseModel();
  }

  public getBrandWarehouses = async (
    locationIds: string[],
    params?: { type?: WarehouseType; status?: WarehouseStatus }
  ): Promise<WarehouseEntity[]> => {
    const { type, status } = params || {};

    const query = `
    FOR warehouse IN warehouses
    FILTER warehouse.deleted_at == null
    FILTER warehouse.location_id IN @locationIds
    ${type ? `FILTER warehouse.type == ${type}` : ""}
    ${status ? `FILTER warehouse.status == ${status}` : ""}
    RETURN warehouse
  `;

    const result = await this.model.rawQueryV2(query, {
      locationIds,
    });

    return result;
  };

  public async getWarehouses(
    warehouseIds: string[]
  ): Promise<WarehouseEntity[]> {
    return await this.model.where("id", "in", warehouseIds).get();
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
  ): Promise<WarehouseEntity[]> {
    const warehouseQuery = `
      FOR warehouse IN @warehouses
      LET target = FIRST(
        FOR ws IN warehouses
        FILTER ws.deleted_at == null
        FILTER ws.id == warehouse.id
        RETURN ws
      )
      UPDATE target._key WITH {
        name: HAS(warehouse, 'name') ? warehouse.name : target.name,
        status: HAS(warehouse, 'status') ? warehouse.status :  target.status,
        updated_at: warehouse.updated_at,
        deleted_at: null
      } IN warehouses
      RETURN true
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
        created_at: warehouse.created_at,
        updated_at: warehouse.updated_at,
        deleted_at: null
      } IN warehouses
      RETURN true
    `;

    return await this.model.rawQueryV2(warehouseQuery, {
      warehouses,
    });
  }
}

export const warehouseRepository = new WarehouseRepository();
export default WarehouseRepository;
