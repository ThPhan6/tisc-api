import { Sequence } from "@/Database/Interfaces";
import { InventoryEntity, Pagination } from "@/types";
import {
  InventoryBasePrice,
  InventoryVolumePrice,
} from "../inventory_prices/inventory_prices.type";

export interface InventoryCreate
  extends Pick<
      InventoryEntity,
      "inventory_category_id" | "sku" | "image" | "description"
    >,
    Pick<InventoryBasePrice, "unit_price" | "unit_type"> {
  currency: string;
  volume_prices?: Pick<
    InventoryVolumePrice,
    "discount_price" | "discount_rate" | "max_quantity" | "min_quantity"
  >[];
}

export interface InventoryCategoryQuery {
  category_id?: string;
  limit: number;
  offset: number;
  sort?: string;
  order?: Sequence;
  search?: string;
}

export interface InventoryListResponse extends InventoryEntity {
  price: InventoryBasePrice & { volume_prices: InventoryVolumePrice[] | null };
}

export interface InventoryCategoryListWithPaginate {
  data: InventoryListResponse[];
  pagination: Pagination;
}

export interface InventoryDetailResponse
  extends InventoryEntity,
    InventoryBasePrice {
  volume_prices: null | InventoryVolumePrice[];
  currency: string;
}

export interface LatestPrice extends InventoryBasePrice {
  volume_prices: InventoryVolumePrice[];
}
