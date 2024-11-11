import WarehouseModel from "@/models/warehouse.model";
import BaseRepository from "@/repositories/base.repository";
import { WarehouseEntity, WarehouseType } from "@/types";

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
}

export const warehouseRepository = new WarehouseRepository();
export default WarehouseRepository;
