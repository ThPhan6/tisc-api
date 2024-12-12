import { WarehouseStatus } from "./warehouse.type";

export interface InventoryLedgerEntity {
  id: string;
  warehouse_id: string;
  inventory_id: string;
  quantity: number;
  status: WarehouseStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
