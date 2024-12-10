import { MultipleInventoryVolumePricePriceRequest } from "@/api/inventory_prices/inventory_volume_price";
import InventoryVolumePriceModel from "@/models/inventory_volume_prices.model";
import { InventoryVolumePriceEntity } from "@/types";
import BaseRepository from "./base.repository";
import { getTimestamps } from "@/Database/Utils/Time";
import { randomUUID } from "crypto";

class InventoryVolumePriceRepository extends BaseRepository<InventoryVolumePriceEntity> {
  protected model: InventoryVolumePriceModel;
  constructor() {
    super();
    this.model = new InventoryVolumePriceModel();
  }

  public async createMultiple(
    inventoryVolumePrices: Partial<MultipleInventoryVolumePricePriceRequest>[]
  ): Promise<InventoryVolumePriceEntity[]> {
    const inventoryQuery = `
      FOR inventory IN @inventoryVolumePrices
      INSERT {
        id: ${randomUUID()},
        inventory_base_price_id: inventory.inventory_base_price_id,
        discount_price: inventory.discount_price,
        discount_rate: inventory.discount_rate,
        max_quantity: inventory.max_quantity,
        min_quantity: inventory.min_quantity,
        created_at: ${getTimestamps()},
        updated_at: ${getTimestamps()},
        deleted_at: null
      } IN inventory_volume_prices
      RETURN UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
    `;

    return await this.model.rawQueryV2(inventoryQuery, {
      inventoryVolumePrices,
    });
  }
}

export const inventoryVolumePriceRepository =
  new InventoryVolumePriceRepository();
export default InventoryVolumePriceRepository;
