export interface InventoryActionEntity {
  id: string;
  warehouse_id: string;
  inventory_id: string;
  quantity: number;
  type: InventoryActionType;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
}

export enum InventoryActionType {
  IN = 1,
  OUT = 2,
}

export enum InventoryActionDescription {
  ADJUST = "ADJUST",
  TRANSFER_TO = "TRANSFER_TO",
  TRANSFER_FROM = "TRANSFER_FROM",
}
