export interface InventoryEntity {
  id: string;
  inventory_category_id: string;
  sku: string;
  image: string;
  description: null | string;
  created_at: string;
  updated_at: null | string;
  deleted_at: null | string;
}
