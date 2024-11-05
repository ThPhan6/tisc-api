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
