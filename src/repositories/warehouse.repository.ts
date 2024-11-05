import WarehouseModel from "@/models/warehouse.model";
import BaseRepository from "@/repositories/base.repository";
import { WarehouseEntity } from "@/types";

class WarehouseRepository extends BaseRepository<WarehouseEntity> {
  protected model: WarehouseModel;

  constructor() {
    super();
    this.model = new WarehouseModel();
  }
}

export const warehouseRepository = new WarehouseRepository();
export default WarehouseRepository;
