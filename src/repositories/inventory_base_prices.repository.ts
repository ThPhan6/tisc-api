import { InventoryBasePriceEntity } from "@/types/inventory_base_prices.type";
import BaseRepository from "./base.repository";
import InventoryBasePriceModel from "@/models/inventory_base_prices.model";
import { head } from "lodash";

class InventoryBasePriceRepository extends BaseRepository<InventoryBasePriceEntity> {
  protected model: InventoryBasePriceModel;
  constructor() {
    super();
    this.model = new InventoryBasePriceModel();
  }

  public async getLatestBasePriceByInventoryId(inventoryId: string) {
    const result = await this.model
      .where("deleted_at", "==", null)
      .where("inventory_id", "==", inventoryId)
      .order("created_at", "DESC")
      .first();

    return result as InventoryBasePriceEntity;
  }
}

export const inventoryBasePriceRepository = new InventoryBasePriceRepository();
export default InventoryBasePriceRepository;
