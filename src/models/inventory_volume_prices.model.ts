import Model from "@/Database/Model";
import { InventoryVolumePriceEntity } from "@/types";

export default class InventoryVolumePriceModel extends Model<InventoryVolumePriceEntity> {
  protected table = "inventory_volume_prices";
  protected softDelete = true;
}
