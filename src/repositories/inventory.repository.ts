import {
  InventoryCategoryListWithPaginate,
  InventoryCategoryQuery,
  LatestPrice,
} from "@/api/inventory/inventory.type";
import { pagination } from "@/helpers/common.helper";
import InventoryModel from "@/models/inventory.model";
import BaseRepository from "@/repositories/base.repository";
import { InventoryEntity } from "@/types";
import { isNil, omitBy } from "lodash";

class InventoryRepository extends BaseRepository<InventoryEntity> {
  protected model: InventoryModel;

  constructor() {
    super();
    this.model = new InventoryModel();
  }

  private latestPriceByInventoryIdQuery = `
    FOR price IN inventory_base_prices
    FILTER price.deleted_at == null
    FILTER price.inventory_id == @inventoryId
    SORT price.created_at DESC
    LIMIT 1

    LET inventoryVolumePrice = (
      FOR volumePrice IN inventory_volume_prices
      FILTER volumePrice.deleted_at == null
      FILTER volumePrice.inventory_base_price_id == price.id
      SORT volumePrice.created_at DESC
      RETURN UNSET(volumePrice, ['_key','_id','_rev','deleted_at'])
    )

    RETURN MERGE(
      KEEP(price, 'id', 'unit_price', 'unit_type', 'created_at'),
      {volume_prices: inventoryVolumePrice}
    )`;

  public async getList(
    query: InventoryCategoryQuery
  ): Promise<InventoryCategoryListWithPaginate> {
    const { limit, offset = 0, category_id, sort, search, order } = query;

    console.log("query", query);

    const rawQuery = `
      FOR inventory IN inventories
      FILTER inventory.deleted_at == null
      ${
        category_id
          ? "FILTER inventory.inventory_category_id == @category_id"
          : ""
      }
      ${search ? `FILTER inventory.sku LIKE "%${search}%"` : ""}
      ${sort && order ? `SORT inventory.@sort @order` : ""}
      ${!isNil(limit) && !isNil(offset) ? `LIMIT ${offset}, ${limit}` : ""}
      SORT inventory.created_at DESC

      LET latestPrice = (FOR price IN inventory_base_prices
        FILTER price.deleted_at == null
        FILTER price.inventory_id == inventory.id
        SORT price.created_at DESC
        LIMIT 1

        LET inventoryVolumePrice = (
          FOR volumePrice IN inventory_volume_prices
          FILTER volumePrice.deleted_at == null
          FILTER volumePrice.inventory_base_price_id == price.id
          SORT volumePrice.created_at DESC
          RETURN UNSET(volumePrice, ['_key','_id','_rev','deleted_at'])
        )

        RETURN MERGE(
          KEEP(price, 'id', 'unit_price', 'unit_type', 'created_at'),
          {volume_prices: inventoryVolumePrice}
        ))

      LET inventoryData = UNSET(inventory, ["_id", "_key", "_rev", "deleted_at"])
      RETURN MERGE(inventoryData, {price: latestPrice[0]})
      `;

    const result = await this.model.rawQueryV2(
      `FOR item IN (${rawQuery}) SORT item.price.unit_price.created_at DESC RETURN item`,
      omitBy({ category_id, sort, order }, isNil)
    );

    return {
      data: result,
      pagination: pagination(limit ?? 10, offset, result.length),
    };
  }

  /// get latest base and volume prices
  public async getLatestPrice(
    inventoryId: string
  ): Promise<LatestPrice | null> {
    const result = await this.model.rawQueryV2(
      this.latestPriceByInventoryIdQuery,
      {
        inventoryId,
      }
    );
    return result?.[0] ?? null;
  }
}

export const inventoryRepository = new InventoryRepository();
export default InventoryRepository;
