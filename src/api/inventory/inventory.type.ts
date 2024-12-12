import { Sequence } from "@/Database/Interfaces";
import {
  ExchangeHistoryEntity,
  InventoryActionEntity,
  InventoryEntity,
  InventoryLedgerEntity,
  Pagination,
  WarehouseEntity,
} from "@/types";
import { InventoryBasePrice } from "../inventory_prices/inventory_prices.type";
import {
  WarehouseCreate,
  WarehouseResponse,
} from "../warehouses/warehouse.type";
import { InventoryVolumePrice } from "../inventory_prices/inventory_volume_price.type";
import { MultipleInventoryLedgerRequest } from "../inventory_ledger/inventory_ledger.type";
import { MultipleInventoryActionRequest } from "../inventory_action/inventory_action.type";

export interface InventoryCreate
  extends Pick<
      InventoryEntity,
      | "inventory_category_id"
      | "sku"
      | "description"
      | "back_order"
      | "on_order"
    >,
    Pick<InventoryBasePrice, "unit_price" | "unit_type"> {
  image?: string;
  currency: string;
  volume_prices?: Pick<
    InventoryVolumePrice,
    "discount_price" | "discount_rate" | "max_quantity" | "min_quantity"
  >[];
  warehouses?: InventoryWarehouse[];
}

export interface InventoryWarehouse
  extends Pick<WarehouseCreate, "location_id" | "quantity" | "convert"> {
  id?: string;
  index?: number;
}

export interface InventoryErrorList extends InventoryCreate {
  errors: string[];
}

export interface InventoryCategoryQuery {
  category_id?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: Sequence;
  search?: string;
}

export interface InventoryListResponse extends InventoryEntity {
  out_stock: number | null;
  total_stock: number;
  stock_value: number;
  warehouses: WarehouseResponse[];
  price: InventoryBasePrice & {
    volume_prices: InventoryVolumePrice[] | null;
    exchange_histories: ExchangeHistoryEntity[];
  };
}

export interface InventoryCategoryListWithPaginate {
  data: InventoryListResponse[];
  pagination: Pagination | null;
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

export interface InventoryExportRequest {
  types: InventoryExportType[];
  category_id: string;
}

export interface ExportResponse {
  data: string;
  brand_name: string;
  category_name: string;
  statusCode: number;
}

export enum InventoryExportType {
  PRODUCT_ID = 1,
  DESCRIPTION = 2,
  UNIT_PRICE = 3,
  UNIT_TYPE = 4,
  ON_ORDER = 5,
  BACK_ORDER = 6,
  OUT_OF_STOCK = 7,
  TOTAL_STOCK = 8,
  STOCK_VALUE = 9,
  DISCOUNT_RATE = 10,
  DISCOUNT_PRICE = 11,
  MIN_QUANTITY = 12,
  MAX_QUANTITY = 13,
  WAREHOUSE_NAME = 14,
  WAREHOUSE_CITY = 15,
  WAREHOUSE_COUNTRY = 16,
  WAREHOUSE_IN_STOCK = 17,
}

export const InventoryExportTypeLabel = {
  [InventoryExportType.PRODUCT_ID]: "sku",
  [InventoryExportType.DESCRIPTION]: "description",
  [InventoryExportType.UNIT_PRICE]: "unit_price",
  [InventoryExportType.UNIT_TYPE]: "unit_type",
  [InventoryExportType.ON_ORDER]: "on_order",
  [InventoryExportType.BACK_ORDER]: "back_order",
  [InventoryExportType.OUT_OF_STOCK]: "out_stock",
  [InventoryExportType.TOTAL_STOCK]: "total_stock",
  [InventoryExportType.STOCK_VALUE]: "stock_value",

  [InventoryExportType.DISCOUNT_RATE]: "discount_rate",
  [InventoryExportType.DISCOUNT_PRICE]: "discount_price",
  [InventoryExportType.MIN_QUANTITY]: "min_quantity",
  [InventoryExportType.MAX_QUANTITY]: "max_quantity",

  [InventoryExportType.WAREHOUSE_NAME]: "name",
  [InventoryExportType.WAREHOUSE_CITY]: "city_name",
  [InventoryExportType.WAREHOUSE_COUNTRY]: "country_name",
  [InventoryExportType.WAREHOUSE_IN_STOCK]: "in_stock",
};

export interface MultipleInventoryRequest
  extends Pick<
    InventoryEntity,
    | "id"
    | "image"
    | "inventory_category_id"
    | "sku"
    | "description"
    | "back_order"
    | "on_order"
  > {}

export interface MappingInventory extends InventoryCreate {
  id: string;
  _type: "old" | "new"; // to determine if the inventory is new or old
  inventory_base_price_id?: string;
  inventory_ledgers?: MultipleInventoryLedgerRequest[];
  inventory_actions?: MultipleInventoryActionRequest[];
}
