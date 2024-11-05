export interface WarehouseEntity {
  id: string;
  name: string;
  type: WarehouseType;
  status: WarehouseStatus;
  parent_id: string | null;
  location_id: string;
  relation_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export enum WarehouseType {
  PHYSICAL = 1,
  NON_PHYSICAL = 2,
}

export enum WarehouseStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum WarehouseNonPhysicalType {
  IN_STOCK = "IN_STOCK",
  ON_ORDER = "ON_ORDER",
  BACK_ORDER = "BACK_ORDER",
  DONE = "DONE",
}
