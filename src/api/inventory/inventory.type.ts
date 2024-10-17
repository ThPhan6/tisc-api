import { Sequence } from "@/Database/Interfaces";
import { InventoryEntity, Pagination } from "@/types";

export interface InventoryCreate
  extends Pick<
    InventoryEntity,
    "inventory_category_id" | "name" | "sku" | "image" | "description"
  > {
  brand_id: string;
}

export interface InventoryCategoryQuery {
  category_id?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: Sequence;
  search?: string;
}

export interface InventoryCategoryListWithPaginate {
  data: InventoryEntity[];
  pagination: Pagination;
}
