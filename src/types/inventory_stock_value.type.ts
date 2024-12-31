export interface IInventoryStockValueAttributes {
  id: string;
  brand_id: string;
  currency: string;
  rate: number;
  stock_values: {
    inventory_id: string;
    value: number;
  }[];
  created_at: string;
  updated_at: string | null;
}
