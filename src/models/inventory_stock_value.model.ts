import Model from "@/Database/Model";
import { IInventoryStockValueAttributes } from "@/types/inventory_stock_value.type";

export default class InventoryStockValueModel extends Model<IInventoryStockValueAttributes> {
  protected table = "inventory_stock_values";
  protected softDelete = true;
}
