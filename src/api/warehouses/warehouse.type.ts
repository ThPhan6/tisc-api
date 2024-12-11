import { InventoryActionType, WarehouseEntity, WarehouseStatus } from "@/types";

export interface WarehouseCreate extends Pick<WarehouseEntity, "location_id"> {
  quantity: number;
  convert?: number;
  inventory_id: string;
}

export interface NonPhysicalWarehouseCreate
  extends Pick<
    WarehouseEntity,
    "location_id" | "relation_id" | "parent_id" | "name" | "type"
  > {
  quantity: number;
  convert?: number;
  inventory_id: string;
  inventory_action_type: InventoryActionType;
  created_by: string;
  status?: WarehouseStatus;
}

export interface WarehouseResponse
  extends Pick<WarehouseEntity, "id" | "created_at" | "name" | "location_id"> {
  country_name: string;
  city_name: string;
  in_stock: number;
}

export interface WarehouseListResponse {
  warehouses: WarehouseResponse[];
  total_stock: number;
}

export interface WarehouseUpdate {
  changeQuantity: number;
}

export interface WarehouseUpdateBackOrder {
  warehouses: Record<string, WarehouseUpdate>;
  inventoryId: string;
}

export interface MultipleWarehouseRequest
  extends Pick<
    WarehouseEntity,
    | "id"
    | "name"
    | "type"
    | "status"
    | "parent_id"
    | "location_id"
    | "relation_id"
  > {
  quantity: number;
  convert?: number;
}

export interface MultipleWarehouseResponse {
  before: WarehouseEntity;
  after: WarehouseEntity;
}
