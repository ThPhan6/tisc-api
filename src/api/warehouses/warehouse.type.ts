import { WarehouseEntity } from "@/types";

export interface WarehouseCreate
  extends Pick<WarehouseEntity, "id" | "location_id" | "relation_id"> {
  quantity: number;
  inventory_id: string;
}

export interface NonPhysicalWarehouseCreate
  extends Pick<
    WarehouseEntity,
    "location_id" | "relation_id" | "parent_id" | "name" | "type"
  > {
  quantity: number;
  inventory_id: string;
  created_by: string;
}

export interface InStockWarehouseResponse
  extends Pick<WarehouseEntity, "id" | "created_at" | "name"> {
  country_name: string;
  city_name: string;
  in_stock: number;
}

export interface WarehouseListResponse {
  warehouses: InStockWarehouseResponse[];
  total_stock: number;
}
