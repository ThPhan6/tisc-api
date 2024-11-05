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

export interface WarehouseCreate {
  id?: string;
  quantity: number;
  brand_id: string;
  location_id: string;
}
