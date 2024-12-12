import { InventoryVolumePriceEntity } from "@/types";

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

export interface MultipleInventoryVolumePricePriceRequest
  extends Pick<
    InventoryVolumePriceEntity,
    | "discount_price"
    | "discount_rate"
    | "max_quantity"
    | "min_quantity"
    | "inventory_base_price_id"
  > {}
