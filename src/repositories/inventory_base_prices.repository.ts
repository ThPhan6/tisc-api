import { MultipleInventoryBasePriceRequest } from "@/api/inventory_prices/inventory_prices.type";
import InventoryBasePriceModel from "@/models/inventory_base_prices.model";
import { InventoryBasePriceEntity } from "@/types/inventory_base_prices.type";
import BaseRepository from "./base.repository";

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
      LET oldInventories = (
        FOR inventory IN inventory_base_prices
        FILTER inventory.deleted_at == null
        FILTER inventory.inventory_id IN @inventoryBasePrices[*].inventory_id
        SORT inventory.created_at DESC
        RETURN inventory
      )

      FOR inventory IN @inventoryBasePrices
      LET oldInventory = FIRST(
        FOR oldInven IN oldInventories
        FILTER oldInven.inventory_id == inventory.inventory_id
        RETURN oldInven
      )
      INSERT {
        id: inventory.id,
        inventory_id: inventory.inventory_id,
        unit_price: TO_NUMBER(inventory.unit_price) OR oldInventory.unit_price,
        unit_type: inventory.unit_type OR oldInventory.unit_type,
        currency: inventory.currency OR oldInventory.currency,
        created_at: inventory.created_at,
        updated_at: inventory.updated_at,
        deleted_at: null
      } IN inventory_base_prices
      RETURN UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at'])
    `;

    return await this.model.rawQueryV2(inventoryQuery, {
      inventoryBasePrices,
    });
  }
  public findByInventories = async (inventoryIds: string[]) => {
    const query = `
     for basePrice in inventory_base_prices
     filter basePrice.inventory_id in @inventoryIds
     return basePrice
    `;

    return this.model.rawQueryV2(query, {
      inventoryIds,
    });
  };
}

export const inventoryBasePriceRepository = new InventoryBasePriceRepository();
export default InventoryBasePriceRepository;
