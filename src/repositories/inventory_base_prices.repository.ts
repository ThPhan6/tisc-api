import { InventoryBasePriceEntity } from "@/types/inventory_base_prices.type";
import BaseRepository from "./base.repository";
import InventoryBasePriceModel from "@/models/inventory_base_prices.model";

class InventoryBasePriceRepository extends BaseRepository<InventoryBasePriceEntity> {
  protected model: InventoryBasePriceModel;
  constructor() {
    super();
    this.model = new InventoryBasePriceModel();
  }
}

export const inventoryBasePriceRepository = new InventoryBasePriceRepository();
export default InventoryBasePriceRepository;
