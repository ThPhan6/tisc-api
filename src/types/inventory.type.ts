export interface InventoryEntity {
  id: string;
  inventory_category_id: string;
  sku: string;
  image: string;
  description?: string;
  on_order?: number;
  back_order?: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
