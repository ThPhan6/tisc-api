export interface InventoryEntity {
  id: string;
  inventory_category_id: string;
  on_order?: number;
  back_order?: number;
  sku: string;
  image: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
