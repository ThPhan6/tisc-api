import InventoryStockValueModel from "@/models/inventory_stock_value.model";
import { IInventoryStockValueAttributes } from "@/types";
import { head } from "lodash";
import BaseRepository from "./base.repository";

class InventoryStockValueRepository extends BaseRepository<IInventoryStockValueAttributes> {
  protected model: InventoryStockValueModel;
  protected DEFAULT_ATTRIBUTE: Partial<IInventoryStockValueAttributes> = {
    stock_values: [],
  };
  constructor() {
    super();
    this.model = new InventoryStockValueModel();
  }

  public async getTotalStockValue(brandId: string): Promise<number> {
    const rawQuery = `
      LET inventoryStockValue = FIRST(
        FOR isv IN inventory_stock_values
        FILTER isv.brand_id == @brandId
        RETURN isv
      )

      RETURN SUM(
        FOR stockValue IN inventoryStockValue.stock_values
        RETURN stockValue.value
      )
    `;

    const result = await this.model.rawQueryV2(rawQuery, { brandId });

    return head(result) as number;
  }

  public async changeCurrency(
    brandId: string,
    currency: string,
    rate: number
  ): Promise<number> {
    const rawQuery = `
      LET inventoryStockValue = FIRST(
        FOR isv IN inventory_stock_values
        FILTER isv.brand_id == @brandId
        RETURN isv
      )

      LET stockValues = (
        FOR stockValue IN inventoryStockValue.stock_values
        RETURN {
          inventory_id: stockValue.inventory_id,
          value: stockValue.value * @newRate / inventoryStockValue.rate
        }
      )

      FOR isv IN inventory_stock_values
      FILTER isv.brand_id == @brandId
      UPDATE isv WITH { currency: @currency, rate: @newRate, stock_values: stockValues } IN inventory_stock_values
      RETURN NEW
    `;

    return this.model.rawQueryV2(rawQuery, {
      brandId,
      newRate: rate,
      currency,
    });
  }
  public async changeInventoryStockValue(
    brandId: string,
    inventoryId: string,
    value: number
  ): Promise<number> {
    const rawQuery = `
      FOR doc IN inventory_stock_values
      FILTER doc.brand_id == @brandId
      UPDATE doc WITH {
        stock_values: (
          FOR stock IN doc.stock_values
            RETURN stock.inventory_id == @inventoryId
              ? MERGE(stock, { value: @value })
              : stock
        )
      } IN inventory_stock_values
    `;

    return this.model.rawQueryV2(rawQuery, {
      brandId,
      inventoryId,
      value,
    });
  }
  public async changeInventoryStockValueMultiple(
    brandId: string,
    data: { inventoryId: string; value: number }[]
  ): Promise<number> {
    const rawQuery = `
     FOR doc IN inventory_stock_values
      FILTER doc.brand_id == @brandId
      UPDATE doc WITH {
        stock_values: (
          FOR stock IN doc.stock_values
            LET updated = FIRST(
              FOR d IN @data
                FILTER d.inventoryId == stock.inventory_id
                RETURN d
            )
            RETURN updated != null ? MERGE(stock, { value: updated.value }) : stock
        )
      } IN inventory_stock_values
    `;

    return this.model.rawQueryV2(rawQuery, {
      brandId,
      data,
    });
  }
}
export default new InventoryStockValueRepository();
export const inventoryStockValueRepository =
  new InventoryStockValueRepository();
