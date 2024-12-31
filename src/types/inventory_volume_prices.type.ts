export interface InventoryVolumePriceEntity {
  id: string;
  inventory_base_price_id: string;
  discount_price: number;
  discount_rate: number;
  max_quantity: number;
  min_quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}
