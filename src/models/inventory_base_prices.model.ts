import Model from "@/Database/Model";
import { InventoryBasePriceEntity } from "@/types";

export default class InventoryBasePriceModel extends Model<InventoryBasePriceEntity> {
  protected table = "inventory_base_prices";
  protected softDelete = true;
}
