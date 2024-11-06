export interface InventoryActionEntity {
  id: string;
  warehouse_id: string;
  inventory_id: string;
  quantity: number;
  type: number;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
}
