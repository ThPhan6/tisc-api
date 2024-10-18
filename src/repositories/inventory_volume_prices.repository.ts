import InventoryVolumePriceModel from "@/models/inventory_volume_prices.model";
import { InventoryVolumePriceEntity } from "@/types";
import BaseRepository from "./base.repository";

class InventoryVolumePriceRepository extends BaseRepository<InventoryVolumePriceEntity> {
  protected model: InventoryVolumePriceModel;
  constructor() {
    super();
    this.model = new InventoryVolumePriceModel();
  }
}

export const inventoryVolumePriceRepository =
  new InventoryVolumePriceRepository();
export default InventoryVolumePriceRepository;
