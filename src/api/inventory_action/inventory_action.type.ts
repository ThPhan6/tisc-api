import { InventoryActionEntity } from "@/types";

export interface MultipleInventoryActionRequest
  extends Pick<
    InventoryActionEntity,
    | "warehouse_id"
    | "inventory_id"
    | "quantity"
    | "type"
    | "description"
    | "created_by"
  > {}
