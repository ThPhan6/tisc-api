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
  IN_STOCK = 2,
  ON_ORDER = 3,
  BACK_ORDER = 4,
  DONE = 5,
}

export enum WarehouseStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}
