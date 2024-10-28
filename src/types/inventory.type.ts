export interface InventoryEntity {
  id: string;
  inventory_category_id: string;
  sku: string;
  image: {
    small: string;
    large: string;
  };
  description?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
