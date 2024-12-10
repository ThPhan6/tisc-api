import { InventoryBasePriceEntity } from "@/types/inventory_base_prices.type";
import BaseRepository from "./base.repository";
import InventoryBasePriceModel from "@/models/inventory_base_prices.model";
import { head, random } from "lodash";
import { MultipleInventoryBasePriceRequest } from "@/api/inventory_prices/inventory_prices.type";
import { getTimestamps } from "@/Database/Utils/Time";
import { randomUUID } from "crypto";

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

  public async createMultiple(
    inventoryBasePrices: Partial<MultipleInventoryBasePriceRequest>[]
  ): Promise<InventoryBasePriceEntity[]> {
    const inventoryQuery = `
      FOR inventory IN @inventoryBasePrices
      INSERT {
        id: ${randomUUID()},
        inventory_id: inventory.inventory_id,
        unit_price: inventory.unit_price,
        unit_type: inventory.unit_type,
        currency: inventory.currency,
        created_at: ${getTimestamps()},
        updated_at: ${getTimestamps()},
        deleted_at: null
      } IN inventory_base_prices
      RETURN UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
    `;

    return await this.model.rawQueryV2(inventoryQuery, {
      inventoryBasePrices,
    });
  }
}

export const inventoryBasePriceRepository = new InventoryBasePriceRepository();
export default InventoryBasePriceRepository;
