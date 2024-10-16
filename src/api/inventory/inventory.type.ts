import { InventoryEntity } from "@/types";

export interface InventoryCreate
  extends Pick<
    InventoryEntity,
    "inventory_category_id" | "name" | "sku" | "image" | "description"
  > {
  brand_id: string;
}
