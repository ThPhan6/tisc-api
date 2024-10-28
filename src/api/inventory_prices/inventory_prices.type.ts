import { InventoryBasePriceEntity, InventoryVolumePriceEntity } from "@/types";

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

export interface InventoryVolumePrice
  extends Pick<
    InventoryVolumePriceEntity,
    | "id"
    | "discount_price"
    | "discount_rate"
    | "max_quantity"
    | "min_quantity"
    | "inventory_base_price_id"
    | "created_at"
  > {}
