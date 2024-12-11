import { InventoryBasePriceEntity } from "@/types";

export interface InventoryBasePrice
  extends Pick<
    InventoryBasePriceEntity,
    | "id"
    | "unit_price"
    | "unit_type"
    | "inventory_id"
    | "currency"
    | "created_at"
  > {}

export interface InventoryBasePriceRequest
  extends Omit<InventoryBasePrice, "id" | "currency" | "created_at"> {
  relation_id: string;
}

export interface MultipleInventoryBasePriceRequest
  extends Pick<
    InventoryBasePriceEntity,
    "currency" | "unit_price" | "unit_type" | "inventory_id"
  > {}
