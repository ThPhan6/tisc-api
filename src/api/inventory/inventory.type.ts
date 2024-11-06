import { Sequence } from "@/Database/Interfaces";
import { ExchangeHistoryEntity, InventoryEntity, Pagination } from "@/types";
import {
  InventoryBasePrice,
  InventoryVolumePrice,
} from "../inventory_prices/inventory_prices.type";

export interface InventoryCreate
  extends Pick<
      InventoryEntity,
      "inventory_category_id" | "sku" | "description"
    >,
    Pick<InventoryBasePrice, "unit_price" | "unit_type"> {
  image: string;
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
  out_stock: number | null;
  price: InventoryBasePrice & {
    volume_prices: InventoryVolumePrice[] | null;
    exchange_histories: ExchangeHistoryEntity[];
  };
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

export interface InventoryListRequest
  extends Pick<InventoryCreate, "unit_price" | "unit_type" | "volume_prices"> {}
