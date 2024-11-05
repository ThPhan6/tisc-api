export interface WarehouseLedgerEntity {
  id: string;
  warehouse_id: string;
  inventory_id: string;
  quantity: number;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
