import Model from "@/Database/Model";
import { WarehouseEntity } from "@/types";

export default class WarehouseModel extends Model<WarehouseEntity> {
  protected table = "warehouses";
  protected softDelete = true;
}
