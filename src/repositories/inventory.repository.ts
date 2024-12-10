import {
  InventoryCategoryListWithPaginate,
  InventoryCategoryQuery,
  LatestPrice,
} from "@/api/inventory/inventory.type";
import { pagination } from "@/helpers/common.helper";
import InventoryModel from "@/models/inventory.model";
import BaseRepository from "@/repositories/base.repository";
import {
  ExchangeHistoryEntity,
  InventoryEntity,
  WarehouseStatus,
  WarehouseType,
} from "@/types";
import { head, isNil, omitBy } from "lodash";

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
      KEEP(price, 'id', 'unit_price', 'unit_type', 'created_at', 'currency', 'inventory_id'),
      {volume_prices: inventoryVolumePrice}
    )`;

  private totalStockValueQuery = `
    LET totalStockValue = SUM(
      LET activeLedgers = (
        FOR led IN inventory_ledgers
        FILTER led.deleted_at == null
        FILTER led.status == 1
        FILTER led.inventory_id == inven.id

        LET warehouse = FIRST(
          FOR ws IN warehouses
          FILTER ws.deleted_at == null
          FILTER ws.type == ${WarehouseType.IN_STOCK}
          FILTER ws.status == ${WarehouseStatus.ACTIVE}
          FILTER ws.id == led.warehouse_id
          RETURN ws
        )

        FILTER led.warehouse_id == warehouse.id
        RETURN led
      )

      FOR ware IN warehouses
      FILTER ware.deleted_at == null
      FILTER ware.type == ${WarehouseType.IN_STOCK}
      FILTER ware.status == ${WarehouseStatus.ACTIVE}
      FILTER ware.id IN (FOR le IN activeLedgers RETURN le.warehouse_id)

      LET unitPrice = FIRST(
        FOR price IN inventory_base_prices
        FILTER price.deleted_at == null
        FILTER price.inventory_id == inven.id
        SORT price.created_at DESC

        LET rates = (
          FOR history IN exchange_histories
          FILTER history.deleted_at == null
          FILTER history.created_at >= price.created_at
          RETURN history.rate
        )

        RETURN price.unit_price * PRODUCT(rates)
      )

      RETURN SUM(FOR le IN activeLedgers RETURN le.quantity) * unitPrice
      )

      RETURN totalStockValue
    `;

  public async getTotalInventories(brandId: string): Promise<number> {
    const rawQuery = `
      FOR category IN dynamic_categories
      FILTER category.deleted_at == null
      FILTER category.relation_id == @brandId
      FOR inventory IN inventories
      FILTER inventory.deleted_at == null
      FILTER inventory.inventory_category_id == category.id
      COLLECT WITH COUNT INTO length
      RETURN length
    `;

    const result = await this.model.rawQueryV2(rawQuery, { brandId });

    return head(result) as number || 0;
  }

  public async getTotalStockValue(brandId: string): Promise<number> {
    const rawQuery = `
      LET activeCategories = (
        FOR category IN dynamic_categories
        FILTER category.deleted_at == null
        FILTER category.relation_id == @brandId
        RETURN category
      )

      FOR inven IN inventories
      FILTER inven.deleted_at == null
      FILTER inven.inventory_category_id IN (FOR c IN activeCategories RETURN c.id)

      LET total = (${this.totalStockValueQuery})

      FOR amount IN total
      COLLECT AGGREGATE totalStockValueSum = SUM(amount)
      RETURN totalStockValueSum
    `;

    const result = await this.model.rawQueryV2(rawQuery, { brandId });

    return head(result) as number || 0;
  }

  public async getExchangeHistoryOfPrice(
    priceCreatedAt: string
  ): Promise<ExchangeHistoryEntity[]> {
    return await this.model.rawQueryV2(
      `FOR history IN exchange_histories
      FILTER history.deleted_at == null
      FILTER history.created_at >= @priceCreatedAt
      RETURN UNSET(history, ['_key','_id','_rev','deleted_at'])
      `,
      { priceCreatedAt }
    );
  }

  public async getList(
    query: InventoryCategoryQuery
  ): Promise<InventoryCategoryListWithPaginate> {
    const {
      limit,
      offset,
      category_id,
      sort = "sku",
      search,
      order = "ASC",
    } = query;

    const rawQuery = `
      FOR inventory IN inventories
      FILTER inventory.deleted_at == null
      ${
        category_id
          ? "FILTER inventory.inventory_category_id == @category_id"
          : ""
      }
      ${search ? `FILTER LOWER(inventory.sku) LIKE "%${search}%"` : ""}
      ${sort && order ? `SORT inventory.@sort @order` : ""}
      ${!isNil(limit) && !isNil(offset) ? `LIMIT ${offset}, ${limit}` : ""}

      LET latestPrice = FIRST(
        FOR price IN inventory_base_prices
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

        LET exchangeHistories = (
          FOR history IN exchange_histories
          FILTER history.deleted_at == null
          FILTER history.created_at >= price.created_at
          RETURN UNSET(history, ['_key','_id','_rev','deleted_at'])
        )

        RETURN MERGE(
          KEEP(price, 'id', 'unit_price', 'unit_type', 'created_at', 'currency', 'inventory_id'),
          {volume_prices: inventoryVolumePrice, exchange_histories: exchangeHistories}
        ))

        LET inventoryData = UNSET(inventory, ['_id','_key','_rev','deleted_at'])
        RETURN MERGE(inventoryData, {price: latestPrice})
      `;

    const result = await this.model.rawQueryV2(
      rawQuery,
      omitBy({ category_id, sort, order }, isNil)
    );

    let total = result.length;
    if (category_id) {
      total = await this.model
        .where("inventory_category_id", "==", category_id)
        .count();
    }

    if (!isNil(limit) && !isNil(offset)) {
      return {
        data: result,
        pagination: pagination(limit, offset, total),
      };
    }

    return {
      data: result,
      pagination: null,
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
    return head(result) as LatestPrice;
  }

  public async getInventoryBySKU(
    sku: string,
    brandId: string
  ): Promise<InventoryEntity | undefined> {
    const inventory = await this.model.rawQueryV2(
      ` LET activeCategories = (
          FOR c IN dynamic_categories
          FILTER c.deleted_at == null
          FILTER c.relation_id == @brandId
          RETURN c
        )

        FOR inventory IN inventories
        FILTER inventory.deleted_at == null
        FILTER LOWER(inventory.sku) == LOWER(@sku)
        FILTER inventory.inventory_category_id IN (FOR c IN activeCategories RETURN c.id)
        RETURN UNSET(inventory, ['_key','_id','_rev','deleted_at'])
      `,
      {
        sku,
        brandId,
      }
    );

    return head(inventory) as Promise<InventoryEntity | undefined>;
  }

  public async getAllInventoryByBrand(
    brandId: string
  ): Promise<InventoryEntity[]> {
    const inventory = await this.model.rawQueryV2(
      ` LET activeCategories = (
          FOR c IN dynamic_categories
          FILTER c.deleted_at == null
          FILTER c.relation_id == @brandId
          RETURN c
        )

        FOR inventory IN inventories
        FILTER inventory.deleted_at == null
        FILTER inventory.inventory_category_id IN (FOR c IN activeCategories RETURN c.id)
        RETURN UNSET(inventory, ['_key','_id','_rev','deleted_at'])
      `,
      {
        brandId,
      }
    );

    return (inventory ?? []) as Promise<InventoryEntity[]>;
  }
}

export const inventoryRepository = new InventoryRepository();
export default InventoryRepository;
