import { WarehouseStatus, WarehouseType } from "./warehouse.type";

export interface InventoryLedgerEntity {
  id: string;
  warehouse_id: string;
  inventory_id: string;
  quantity: number;
  status: WarehouseStatus;
  type: WarehouseType;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
