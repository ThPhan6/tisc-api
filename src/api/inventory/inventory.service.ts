import { COMMON_TYPES, MESSAGES } from "@/constants";
import { getTimestamps } from "@/Database/Utils/Time";
import {
  jsonToCSV,
  REGEX_ORDER,
  renameKeys,
  sortObjectByKey,
} from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { exchangeCurrencyRepository } from "@/repositories/exchange_currency.repository";
import { exchangeHistoryRepository } from "@/repositories/exchange_history.repository";
import { inventoryRepository } from "@/repositories/inventory.repository";
import { inventoryBasePriceRepository } from "@/repositories/inventory_base_prices.repository";
import { inventoryLedgerRepository } from "@/repositories/inventory_ledger.repository";
import { warehouseRepository } from "@/repositories/warehouse.repository";
import { deleteFile } from "@/services/aws.service";
import {
  uploadImagesInventory,
  validateImageType,
} from "@/services/image.service";
import {
  CommonTypeAttributes,
  CompanyFunctionalGroup,
  InventoryEntity,
  InventoryLedgerEntity,
  LocationWithTeamCountAndFunctionType,
  UserAttributes,
  WarehouseEntity,
  WarehouseStatus,
  WarehouseType,
} from "@/types";
import {
  chunk,
  forEach,
  isEmpty,
  isNil,
  isString,
  lastIndexOf,
  map,
  omit,
  orderBy,
  partition,
  pick,
  reduce,
  sortBy,
  sumBy,
  uniq,
  uniqBy,
} from "lodash";
import { v4 as uuid } from "uuid";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import { ExchangeCurrencyRequest } from "../exchange_history/exchange_history.type";
import { inventoryActionService } from "../inventory_action/inventory_action.service";
import { MultipleInventoryActionRequest } from "../inventory_action/inventory_action.type";
import { inventoryLedgerService } from "../inventory_ledger/inventory_ledger.service";
import { MultipleInventoryLedgerRequest } from "../inventory_ledger/inventory_ledger.type";
import { inventoryBasePriceService } from "../inventory_prices/inventory_base_prices.service";
import { MultipleInventoryBasePriceRequest } from "../inventory_prices/inventory_prices.type";
import {
  InventoryVolumePrice,
  MultipleInventoryVolumePricePriceRequest,
} from "../inventory_prices/inventory_volume_price.type";
import { inventoryVolumePriceService } from "../inventory_prices/inventory_volume_prices.service";
import { locationService } from "../location/location.service";
import { warehouseService } from "../warehouses/warehouse.service";
import {
  WarehouseCreate,
  WarehouseListResponse,
  WarehouseResponse,
} from "../warehouses/warehouse.type";
import {
  ExportResponse,
  InventoryCategoryQuery,
  InventoryCreate,
  InventoryErrorList,
  InventoryExportRequest,
  InventoryExportType,
  InventoryExportTypeLabel,
  InventoryListRequest,
  InventoryListResponse,
  InventoryWarehouse,
  LatestPrice,
  MappingInventory,
  MultipleInventoryRequest,
} from "./inventory.type";

const IMPORT_CHUNK_SIZE = 50;

class InventoryService {
  private transferInventory = (inventory: Record<string, any>) => {
    const newInventory = { ...inventory };

    for (const key in inventory) {
      if (key.startsWith("#") && key.includes("Vol. Discount Price & Qty")) {
        const index = key.split(" ")[0];

        const discountPriceKey = `${index} Vol. Discount Price & Qty`;
        const minQtyKey = `${index} Vol. Min. Qty`;
        const maxQtyKey = `${index} Vol. Max. Qty`;

        const priceAndQty = `${inventory[discountPriceKey]}, ${inventory[minQtyKey]}-${inventory[maxQtyKey]}`;

        newInventory[discountPriceKey] = priceAndQty;
        delete newInventory[minQtyKey];
        delete newInventory[maxQtyKey];
      }

      if (key.startsWith("#") && key.includes("Warehouse")) {
        const index = key.split(" ")[0];

        delete newInventory[`${index} Warehouse Name`];
        delete newInventory[`${index} Warehouse Country`];
        delete newInventory[`${index} Warehouse City`];
      }
    }

    return newInventory;
  };

  private formatCSVColumn = (header: string[], content: any[]) =>
    content.map((el) => {
      const newEl: any = {};

      const orderedKeys = Object.keys(el)
        .map((key) => (key.startsWith("#") ? key : undefined))
        .filter(Boolean) as string[];

      const warehouseGroupKeys = orderedKeys.filter(
        (key) =>
          key.endsWith(
            `_${InventoryExportTypeLabel[InventoryExportType.WAREHOUSE_NAME]}`
          ) ||
          key.endsWith(
            `_${
              InventoryExportTypeLabel[InventoryExportType.WAREHOUSE_COUNTRY]
            }`
          ) ||
          key.endsWith(
            `_${InventoryExportTypeLabel[InventoryExportType.WAREHOUSE_CITY]}`
          ) ||
          key.endsWith(
            `_${
              InventoryExportTypeLabel[InventoryExportType.WAREHOUSE_IN_STOCK]
            }`
          )
      );

      const volumePriceGroupKeys = orderedKeys.filter(
        (key) =>
          key.endsWith(
            `_${InventoryExportTypeLabel[InventoryExportType.DISCOUNT_PRICE]}`
          ) ||
          key.endsWith(
            `_${InventoryExportTypeLabel[InventoryExportType.DISCOUNT_RATE]}`
          ) ||
          key.endsWith(
            `_${InventoryExportTypeLabel[InventoryExportType.MIN_QUANTITY]}`
          ) ||
          key.endsWith(
            `_${InventoryExportTypeLabel[InventoryExportType.MAX_QUANTITY]}`
          )
      );

      forEach(
        sortObjectByKey(el, [
          "sku",
          "description",
          "unit_price",
          "unit_type",
          ...warehouseGroupKeys,
          "total_stock",
          "stock_value",
          "out_stock",
          "on_order",
          "back_order",
          ...volumePriceGroupKeys,
        ]),
        (value, key) => {
          if (header.includes(key.replace(REGEX_ORDER, ""))) {
            newEl[key] = value;
          }
        }
      );

      const changedKeys = orderedKeys
        .map((key) => {
          const newKey = key.replace(REGEX_ORDER, "");
          const ordered = key.split("_")?.[0];

          if (
            newKey ===
            InventoryExportTypeLabel[InventoryExportType.WAREHOUSE_NAME]
          ) {
            return {
              [key]: `${ordered} Warehouse Name`,
            };
          }

          if (
            newKey ===
            InventoryExportTypeLabel[InventoryExportType.WAREHOUSE_COUNTRY]
          ) {
            return {
              [key]: `${ordered} Warehouse Country`,
            };
          }

          if (
            newKey ===
            InventoryExportTypeLabel[InventoryExportType.WAREHOUSE_CITY]
          ) {
            return {
              [key]: `${ordered} Warehouse City`,
            };
          }

          if (
            newKey ===
            InventoryExportTypeLabel[InventoryExportType.WAREHOUSE_IN_STOCK]
          ) {
            return {
              [key]: `${el[`${ordered}_name`]} In Stock`,
            };
          }

          if (
            newKey ===
            InventoryExportTypeLabel[InventoryExportType.DISCOUNT_PRICE]
          ) {
            return {
              [key]: `${ordered} Vol. Discount Price & Qty`,
            };
          }

          if (
            newKey ===
            InventoryExportTypeLabel[InventoryExportType.DISCOUNT_RATE]
          ) {
            return {
              [key]: `${ordered} Vol. Discount %`,
            };
          }

          if (
            newKey ===
            InventoryExportTypeLabel[InventoryExportType.MIN_QUANTITY]
          ) {
            return {
              [key]: `${ordered} Vol. Min. Qty`,
            };
          }

          if (
            newKey ===
            InventoryExportTypeLabel[InventoryExportType.MAX_QUANTITY]
          ) {
            return {
              [key]: `${ordered} Vol. Max. Qty`,
            };
          }

          return undefined;
        })
        .filter(Boolean) as Record<string, string>[];

      return this.transferInventory(
        renameKeys(newEl, [
          ...changedKeys,
          { sku: "Product ID" },
          { unit_price: "Base Price" },
        ])
      );
    });

  private convertInventoryArrayToCsv = (
    typeHeaders: InventoryExportType[],
    content: InventoryListResponse[]
  ) => {
    const headerSelected: string[] = typeHeaders.map(
      (el) => InventoryExportTypeLabel[el]
    );

    const contentFlat = content.map((item) => {
      const newContent: any = {
        ...omit(item, ["price", "warehouses"]),
        unit_price: item.price.unit_price.toFixed(2),
        unit_type: item.price.unit_type,
        currency: item.price.currency,
        stock_value: item.stock_value.toFixed(2),
      };

      forEach(
        item.price.volume_prices,
        (volumePrice: InventoryVolumePrice, idx: number) => {
          forEach(
            sortObjectByKey(volumePrice, [
              "discount_rate",
              "discount_price",
              "min_quantity",
              "max_quantity",
            ]),
            (price, key: string) => {
              if (headerSelected.includes(key)) {
                newContent[`#${idx + 1}_${key}`] =
                  key === "discount_price"
                    ? `${newContent.currency_symbol} ${Number(price).toFixed(
                        2
                      )}`
                    : key === "discount_rate"
                    ? `${price}%`
                    : price;
              }
            }
          );
        }
      );

      forEach(item.warehouses, (warehouse: WarehouseResponse, idx: number) => {
        forEach(
          sortObjectByKey(warehouse, [
            "name",
            "country_name",
            "city_name",
            "in_stock",
          ]),
          (value, key: string) => {
            if (headerSelected.includes(key)) {
              newContent[`#${idx + 1}_${key}`] = value;
            }
          }
        );
      });

      newContent.unit_price = `${newContent.currency_symbol} ${newContent.unit_price}`;
      newContent.stock_value = `${newContent.currency_symbol} ${newContent.stock_value}`;

      return newContent;
    });

    return jsonToCSV(this.formatCSVColumn(headerSelected, contentFlat));
  };

  private pushErrorMessages(
    errors: InventoryErrorList[],
    item: InventoryCreate,
    message: string
  ) {
    const newErrors = [...errors];

    const index = lastIndexOf(
      newErrors.map((err) => err.sku),
      item.sku
    );

    if (index !== -1) {
      newErrors[index].errors.push(message);
    } else {
      newErrors.push({
        ...item,
        errors: [message],
      });
    }

    return newErrors;
  }

  private findWarehouseByLocationId(
    locations: LocationWithTeamCountAndFunctionType[],
    existedWarehouse?: (WarehouseEntity & { in_stock: number })[],
    warehousePayload?: InventoryWarehouse[]
  ) {
    return locations.map((location) => {
      const warehouse = warehousePayload?.find(
        (ws) => ws.location_id === location.id
      );
      const existedWarehouseLocation = existedWarehouse?.find(
        (ws) => ws.location_id === warehouse?.location_id
      );

      return {
        ...omit(existedWarehouseLocation, ["in_stock"]),
        name: location.business_name,
        location_id: location.id,
        quantity:
          warehouse?.quantity ?? existedWarehouseLocation?.in_stock ?? 0,
      };
    });
  }

  private validateImportPayload(
    existedInventories: InventoryEntity[],
    commonTypeAttributes: CommonTypeAttributes[],
    inventories: InventoryCreate[]
  ) {
    let errors: InventoryErrorList[] = [];
    const commonTypeIds = commonTypeAttributes.map((el) => el.id);

    inventories.forEach((inventory) => {
      const existedInventory = existedInventories.find(
        (inven) => inven.sku.toLowerCase() === inventory.sku.toLowerCase()
      );

      if (
        existedInventory &&
        inventory.inventory_category_id !==
          existedInventory.inventory_category_id
      ) {
        errors = this.pushErrorMessages(
          errors,
          inventory,
          MESSAGES.INVENTORY.BELONG_TO_ANOTHER_CATEGORY
        );
      }

      if ("unit_price" in inventory) {
        if (!inventory.unit_price) {
          errors = this.pushErrorMessages(
            errors,
            inventory,
            MESSAGES.INVENTORY.UNIT_PRICE_LESS_THAN_ZERO
          );
        }
      }

      if ("unit_type" in inventory) {
        const unitType = commonTypeIds.includes(inventory.unit_type);

        if (!unitType) {
          errors = this.pushErrorMessages(
            errors,
            inventory,
            MESSAGES.UNIT_TYPE_NOT_FOUND
          );
        }
      }

      if ("warehouses" in inventory) {
        if (inventory.warehouses?.some((el) => el.quantity < 0)) {
          errors = this.pushErrorMessages(
            errors,
            inventory,
            MESSAGES.WAREHOUSE.LESS_THAN_ZERO
          );
        }
      }
    });

    return errors;
  }

  private validateImportPayloadInsert(
    commonTypeAttributes: CommonTypeAttributes[],
    inventories: InventoryCreate[]
  ) {
    let errors: InventoryErrorList[] = [];
    const commonTypeIds = commonTypeAttributes.map((el) => el.id);

    inventories.map(async (inventory) => {
      if (!inventory?.unit_price) {
        errors = this.pushErrorMessages(
          errors,
          inventory,
          MESSAGES.INVENTORY.UNIT_PRICE_REQUIRED
        );
      }

      if (!inventory?.unit_type) {
        errors = this.pushErrorMessages(
          errors,
          inventory,
          MESSAGES.INVENTORY.UNIT_PRICE_REQUIRED
        );
      } else {
        const unitType = commonTypeIds.includes(inventory.unit_type);

        if (!unitType) {
          errors = this.pushErrorMessages(
            errors,
            inventory,
            MESSAGES.UNIT_TYPE_NOT_FOUND
          );
        }
      }

      if ("warehouses" in inventory) {
        if (inventory.warehouses?.some((el) => el.quantity < 0)) {
          errors = this.pushErrorMessages(
            errors,
            inventory,
            MESSAGES.WAREHOUSE.LESS_THAN_ZERO
          );
        }
      }
    });

    return errors;
  }

  private isValidVolumePrices(
    volumePrices: Pick<
      InventoryVolumePrice,
      "min_quantity" | "discount_price" | "discount_rate" | "max_quantity"
    >[]
  ) {
    if (!volumePrices?.length) {
      return true;
    }

    const discountRates = volumePrices.map((price) => price.discount_rate);
    const discountRateDuplicated = discountRates.filter(
      (rate, index) => discountRates.indexOf(rate) !== index
    );

    if (discountRateDuplicated.length) return false;

    let isValidVolumePrice = true;
    volumePrices.forEach((el) => {
      if (
        el.min_quantity === 0 ||
        el.max_quantity === 0 ||
        el.discount_rate === 0 ||
        (el?.max_quantity || 0) - (el?.min_quantity || 0) <= 1
      ) {
        isValidVolumePrice = false;
      }
    });

    if (!isValidVolumePrice) return false;

    const newVolumePrices = sortBy(volumePrices, "min_quantity");

    for (let i = 1; i < newVolumePrices.length; i++) {
      if (
        newVolumePrices[i].min_quantity <= newVolumePrices[i - 1].max_quantity
      ) {
        return false;
      }
    }

    return true;
  }

  private async createInventoryPrices(
    inventoryId: string,
    brandId: string,
    payload: Partial<
      Pick<InventoryCreate, "unit_price" | "unit_type" | "volume_prices">
    >
  ) {
    const { unit_price, unit_type, volume_prices = [] } = payload;

    if (!inventoryId || !brandId) {
      return;
    }

    if (!this.isValidVolumePrices(volume_prices))
      return {
        basePrice: null,
        volumePrices: null,
        message: MESSAGES.INVENTORY.INVALID_VOLUME_PRICES,
      };

    /// create base price
    const basePrice = await inventoryBasePriceService.create({
      unit_price,
      unit_type,
      inventory_id: inventoryId,
      relation_id: brandId,
    });

    if (!basePrice.data) {
      return {
        basePrice: basePrice.data,
        volumePrices: null,
        message:
          basePrice?.message ??
          MESSAGES.SOMETHING_WRONG_CREATE_INVENTORY_BASE_PRICE,
      };
    }

    /// create volume prices
    const volumePrices = await inventoryVolumePriceService.create(
      basePrice.data,
      volume_prices
    );

    if (!volumePrices.data) {
      return {
        basePrice: basePrice.data,
        volumePrices: volumePrices.data,
        message:
          volumePrices?.message ??
          MESSAGES.SOMETHING_WRONG_CREATE_INVENTORY_VOLUME_PRICE,
      };
    }

    return {
      basePrice: basePrice.data,
      volumePrices: volumePrices.data,
    };
  }

  private async modifyWarehouses(
    user: UserAttributes,
    inventoryId: string,
    warehouses: Pick<WarehouseCreate, "location_id" | "quantity" | "convert">[]
  ) {
    if (!warehouses?.length) {
      return errorMessageResponse(MESSAGES.WAREHOUSE.REQUIRED);
    }

    const uniqueLocationIds = uniqBy(warehouses, "location_id");
    const count = uniqueLocationIds.length;

    if (count !== warehouses?.length) {
      return errorMessageResponse(MESSAGES.WAREHOUSE.LOCATION_DUPLICATED);
    }

    const payloadWarehouseLocationIds = warehouses.map((el) => el.location_id);
    const instockWarehouseActive = (await warehouseService.getList(
      user,
      inventoryId,
      {
        status: WarehouseStatus.ACTIVE,
      }
    )) as {
      data: WarehouseListResponse;
      message: string;
      statusCode: number;
    };

    if (instockWarehouseActive?.statusCode !== 200) {
      return {
        message: instockWarehouseActive.message,
        statusCode: instockWarehouseActive.statusCode,
      };
    }

    /// instock warehouses are not in payload
    const warehouseDeleted = instockWarehouseActive.data.warehouses
      .filter((el) => !payloadWarehouseLocationIds.includes(el.location_id))
      .map((el) => ({
        location_id: el.location_id,
        quantity: el.in_stock,
      }));

    const res = [];

    if (warehouseDeleted.length) {
      const deletedWarehouses = await Promise.all(
        warehouseDeleted.map(
          async (ws) => await warehouseService.delete(user, ws.location_id)
        )
      );

      res.push(...deletedWarehouses);
    }
    /// create new warehouse and update warehouse existed
    const warehouseUpdated = await Promise.all(
      warehouses.map(async (ws) => {
        const temp = await warehouseService.create(user, {
          inventory_id: inventoryId,
          location_id: ws.location_id,
          quantity: ws.quantity,
          convert: ws.convert,
        });
        return temp;
      })
    );
    res.push(...warehouseUpdated);

    const messageError = res
      .filter((el) => el?.statusCode !== 200)
      .map((el) => el?.message);

    if (messageError.length) {
      return {
        message: messageError.join(", "),
        statusCode: 400,
      };
    }

    return {
      statusCode: 200,
      message: MESSAGES.SUCCESS,
    };
  }

  public async get(id: string) {
    const inventory = await inventoryRepository.find(id);

    if (!inventory) {
      return errorMessageResponse(MESSAGES.NOT_FOUND, 404);
    }

    const latestPrice = await inventoryRepository.getLatestPrice(inventory.id);

    if (!latestPrice) {
      return errorMessageResponse(MESSAGES.INVENTORY_BASE_PRICE_NOT_FOUND, 404);
    }

    const exchangeHistories =
      await inventoryRepository.getExchangeHistoryOfPrice(
        latestPrice.created_at
      );

    return successResponse({
      data: {
        ...omit(inventory, ["image"]),
        image: inventory?.image ?? "",
        price: {
          ...latestPrice,
          exchange_histories: exchangeHistories?.length
            ? exchangeHistories
            : null,
          volume_prices: latestPrice?.volume_prices?.length
            ? latestPrice.volume_prices
            : null,
        },
      },
    });
  }

  public async getList(user: UserAttributes, query: InventoryCategoryQuery) {
    const { is_get_warehouse: isGetWarehouse = true, ...restQuery } = query;

    const inventoryList = await inventoryRepository.getList(restQuery);
    if (!inventoryList) {
      return errorMessageResponse(MESSAGES.NOT_FOUND, 404);
    }

    const inventories = await Promise.all(
      inventoryList.data.map(async (inventory) => {
        const rate = isEmpty(inventory.price?.exchange_histories)
          ? 1
          : sumBy(inventory.price.exchange_histories, "rate");

        const newInventory = {
          ...omit(inventory, ["image"]),
          image: inventory.image ?? "",
          price: isEmpty(inventory?.price)
            ? null
            : {
                ...inventory.price,
                exchange_histories: inventory.price?.exchange_histories?.length
                  ? inventory.price.exchange_histories
                  : null,
                volume_prices: inventory.price?.volume_prices?.length
                  ? inventory.price.volume_prices
                  : null,
              },
        };

        if (!isGetWarehouse) return newInventory;

        const warehouses = (await warehouseService.getList(
          user,
          newInventory.id,
          {
            status: WarehouseStatus.ACTIVE,
          }
        )) as unknown as {
          data: WarehouseListResponse;
        };

        const totalStock = warehouses.data.total_stock;
        const outStock = (newInventory?.on_order ?? 0) - totalStock;

        const stock = {
          stock_value: rate * (inventory.price?.unit_price || 0) * totalStock,
          total_stock: totalStock,
          out_stock: outStock <= 0 ? 0 : -outStock,
        };

        return {
          ...newInventory,
          ...stock,
          warehouses: isEmpty(warehouses.data)
            ? []
            : warehouses.data.warehouses,
        };
      })
    );

    return successResponse({
      data: {
        inventories,
        pagination: inventoryList.pagination,
      },
    });
  }

  public async getSummary(brandId: string) {
    if (!brandId) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    const baseCurrency = await exchangeCurrencyRepository.getBaseCurrencies();

    if (isEmpty(baseCurrency)) {
      return errorMessageResponse(MESSAGES.BASE_CURRENCY_NOT_FOUND, 404);
    }

    const exchangeHistory = await exchangeHistoryRepository.getLatestHistory(
      brandId
    );

    if (!exchangeHistory) {
      return errorMessageResponse(MESSAGES.EXCHANGE_HISTORY_NOT_FOUND, 404);
    }

    const totalProduct = await inventoryRepository.getTotalInventories(brandId);

    const inventories = await inventoryRepository.getAllInventoryByBrand(
      brandId
    );
    const inventoryIds = inventories.map((item) => item.id);

    const inventoryLedgers: InventoryLedgerEntity[] =
      await inventoryLedgerRepository.findByInventories(inventoryIds);

    const inventoryBasePrices =
      await inventoryBasePriceRepository.findByInventories(inventoryIds);

    const exchangeHistories = await inventoryRepository.getBrandExchangeHistory(
      brandId
    );

    const total = inventories.reduce((pre, cur) => {
      const ledgers = inventoryLedgers.filter(
        (item: any) => item.inventory_id === cur.id
      );
      const ledgerQuantity = sumBy(ledgers, "quantity");

      const basePrice = orderBy(
        inventoryBasePrices.filter((item: any) => item.inventory_id === cur.id),
        ["created_at"],
        ["desc"]
      )[0];
      let tempRate = 1;
      exchangeHistories.forEach((item: any) => {
        if (item.created_at >= basePrice.created_at)
          tempRate = tempRate * item.rate;
      });

      const inventoryStockValue =
        ledgerQuantity * basePrice.unit_price * tempRate;
      return pre + inventoryStockValue;
    }, 0);

    return successResponse({
      data: {
        currencies: baseCurrency.map((el) => ({
          ...pick(el, ["code", "name", "symbol"]),
        })),
        exchange_history: exchangeHistory,
        total_product: totalProduct,
        total_stock: total,
      },
    });
  }

  public async exchange(payload: ExchangeCurrencyRequest) {
    /// find brand
    const brand = await brandRepository.find(payload.relation_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    /// find previous exchange currency
    const previousBaseCurrency =
      await exchangeHistoryRepository.getLatestHistory(payload.relation_id, {
        createNew: false,
      });

    if (!previousBaseCurrency) {
      return errorMessageResponse(MESSAGES.BASE_CURRENCY_NOT_FOUND, 404);
    }

    /// check if the previous exchange currency is the same as the new one
    if (previousBaseCurrency.to_currency === payload.to_currency) {
      return errorMessageResponse(MESSAGES.EXCHANGE_CURRENCY_THE_SAME);
    }

    const exchangeHistory =
      await exchangeHistoryRepository.createExchangeHistory({
        from_currency: previousBaseCurrency.to_currency,
        to_currency: payload.to_currency,
        relation_id: payload.relation_id,
      });

    if (!exchangeHistory) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_EXCHANGE_CURRENCY);
    }

    return successMessageResponse(MESSAGES.EXCHANGE_CURRENCY_SUCCESS);
  }

  public async create(user: UserAttributes, payload: InventoryCreate) {
    /// find category
    const category = await dynamicCategoryRepository.find(
      payload.inventory_category_id
    );

    if (!category?.relation_id) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_BELONG_TO_BRAND);
    }

    /// find brand
    const brand = await brandRepository.find(category.relation_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    const inventories = await inventoryRepository.getAllInventoryByBrand(
      brand.id
    );
    const isNameExist = inventories.some(
      (el) => el.sku.toLowerCase() === payload.sku.toLowerCase()
    );

    if (isNameExist) {
      return errorMessageResponse(MESSAGES.INVENTORY.SKU_EXISTED);
    }

    const inventoryId = uuid();

    /// upload image
    let image:
      | string
      | {
          largeWebp: string;
          smallWebp: string;
          largePng: string;
          smallPng: string;
        } = "";
    if (payload.image) {
      if (!(await validateImageType([payload.image]))) {
        return errorMessageResponse(MESSAGES.IMAGE_INVALID);
      }

      image = await uploadImagesInventory(
        payload.image,
        brand.name,
        brand.id,
        inventoryId
      );

      if (!image) {
        return errorMessageResponse(MESSAGES.IMAGE_UPLOAD_FAILED);
      }
    }

    /// create inventory base and volume prices
    const inventoryPrice = await this.createInventoryPrices(
      inventoryId,
      category.relation_id,
      {
        unit_price: payload.unit_price,
        unit_type: payload.unit_type,
        volume_prices: payload?.volume_prices,
      }
    );

    if (
      isEmpty(inventoryPrice?.basePrice) ||
      (!isEmpty(payload?.volume_prices) &&
        isEmpty(inventoryPrice?.volumePrices))
    ) {
      return errorMessageResponse(
        inventoryPrice?.message ?? MESSAGES.SOMETHING_WRONG_CREATE
      );
    }

    const newInventory = await inventoryRepository.create({
      ...pick(payload, [
        "sku",
        "inventory_category_id",
        "on_order",
        "back_order",
      ]),
      description: payload.description ?? "",
      image: isString(image) ? image : image.smallWebp,
      id: inventoryId,
    });

    if (!newInventory) {
      if (isString(image)) {
        await deleteFile(image);
      } else {
        Promise.all(
          [
            image.largeWebp,
            image.smallWebp,
            image.largePng,
            image.smallPng,
          ].map(async (el) => await deleteFile(el))
        );
      }

      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const warehouses: Pick<WarehouseCreate, "location_id" | "quantity">[] = [];

    const locations = await locationService.getList(user, {
      sort: "business_name",
      order: "ASC",
      functional_type: CompanyFunctionalGroup.LOGISTIC,
    });

    if (!locations.data.locations.length) {
      return successMessageResponse(MESSAGES.SUCCESS);
    }

    locations.data.locations.forEach((location, index) => {
      warehouses.push({
        location_id: location.id,
        quantity: payload?.warehouses?.[index]?.quantity ?? 0,
      });
    });

    const newWarehouses = await this.modifyWarehouses(
      user,
      newInventory.id,
      warehouses
    );

    if (newWarehouses?.statusCode !== 200) {
      return errorMessageResponse(newWarehouses.message);
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async update(
    user: UserAttributes,
    id: string,
    payload: Partial<InventoryCreate>,
    options: {
      isCheckSKUExisted?: boolean;
    } = {
      isCheckSKUExisted: true,
    }
  ) {
    const existedBrand = await brandRepository.find(user.relation_id);

    if (!existedBrand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    /// find inventory
    const inventoryExisted = await inventoryRepository.find(id);
    if (!inventoryExisted) {
      return errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND, 404);
    }

    if ("sku" in payload && options.isCheckSKUExisted) {
      const inventories = await inventoryRepository.getAllInventoryByBrand(
        existedBrand.id
      );
      const isNameExist = inventories.some(
        (el) => el.sku.toLowerCase() === payload.sku?.toLowerCase()
      );

      if (isNameExist) {
        return errorMessageResponse(MESSAGES.INVENTORY.SKU_EXISTED);
      }
    }

    /// find category to get brand
    const category = await dynamicCategoryRepository.find(
      inventoryExisted.inventory_category_id
    );

    if (!category) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND, 404);
    }
    /// find brand
    const brand = await brandRepository.find(category.relation_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }
    /// upload image
    let image:
      | string
      | {
          largeWebp: string;
          smallWebp: string;
          largePng: string;
          smallPng: string;
        } = inventoryExisted.image;
    if (payload.image) {
      if (!(await validateImageType([payload.image]))) {
        return errorMessageResponse(MESSAGES.IMAGE_INVALID);
      }
      image = await uploadImagesInventory(
        payload.image,
        brand.name,
        brand.id,
        inventoryExisted.id
      );
      if (!image) {
        return errorMessageResponse(MESSAGES.IMAGE_UPLOAD_FAILED);
      }
    }
    /// create inventory base and volume prices
    if (!isNil(payload.unit_price) || !isNil(payload.unit_type)) {
      const inventoryPrice = await this.createInventoryPrices(
        inventoryExisted.id,
        category.relation_id,
        {
          unit_price: payload?.unit_price,
          unit_type: payload?.unit_type,
          volume_prices: payload?.volume_prices,
        }
      );
      if (
        isEmpty(inventoryPrice?.basePrice) ||
        (!isEmpty(payload?.volume_prices) &&
          isEmpty(inventoryPrice?.volumePrices))
      ) {
        return errorMessageResponse(
          inventoryPrice?.message ?? MESSAGES.SOMETHING_WRONG_UPDATE
        );
      }
    }
    /// update inventory
    const updatedInventory = await inventoryRepository.update(id, {
      ...inventoryExisted,
      ...pick(payload, "description", "sku"),
      image: isString(image) ? image : image.smallWebp,
      updated_at: getTimestamps(),
      on_order: payload.on_order ?? inventoryExisted.on_order ?? 0,
      back_order: payload.back_order ?? inventoryExisted.back_order ?? 0,
    });
    if (!updatedInventory) {
      if (isString(image)) {
        await deleteFile(image);
      } else {
        Promise.all(
          [
            image.largeWebp,
            image.smallWebp,
            image.largePng,
            image.smallPng,
          ].map(async (el) => await deleteFile(el))
        );
      }
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    if ("warehouses" in payload) {
      const newWarehouses: Pick<WarehouseCreate, "location_id" | "quantity">[] =
        [];

      const locations = await locationService.getList(user, {
        sort: "business_name",
        order: "ASC",
        functional_type: CompanyFunctionalGroup.LOGISTIC,
      });

      if (!locations.data.locations.length) {
        return successMessageResponse(MESSAGES.SUCCESS);
      }

      locations.data.locations.forEach((location, index) => {
        newWarehouses.push({
          location_id: location.id,
          quantity: payload?.warehouses?.[index].quantity ?? 0,
        });
      });
      const warehouseUpdated = await this.modifyWarehouses(
        user,
        id,
        newWarehouses
      );
      if (warehouseUpdated?.statusCode !== 200) {
        return errorMessageResponse(warehouseUpdated.message);
      }
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async updateInventories(
    user: UserAttributes,
    payload: Record<string, InventoryListRequest>
  ) {
    await Promise.all(
      map(payload, async (value, key) => await this.update(user, key, value))
    );

    return successResponse({
      message: MESSAGES.SUCCESS,
    });
  }

  public async delete(id: string) {
    const inventory = await inventoryRepository.find(id);

    if (!inventory) {
      return errorMessageResponse(MESSAGES.NOT_FOUND, 404);
    }

    const inventoryDeleted = await inventoryRepository.delete(id);

    if (!inventoryDeleted) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    return successResponse({
      message: MESSAGES.SUCCESS,
    });
  }

  public async move(inventoryId: string, categoryId: string) {
    const inventory = await inventoryRepository.find(inventoryId);
    if (!inventory)
      return errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND, 404);

    const category = await dynamicCategoryRepository.find(categoryId);
    if (!category) return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);

    const lastLevel = await dynamicCategoryRepository.getMaxCategoryLevel();

    if (category.level !== +lastLevel)
      return errorMessageResponse("Only the category is acceptable");

    const updatedInventory = await inventoryRepository.update(inventoryId, {
      inventory_category_id: categoryId,
    });

    if (!updatedInventory)
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);

    return successResponse({ message: MESSAGES.SUCCESS });
  }

  public async export(user: UserAttributes, payload: InventoryExportRequest) {
    const inValidPayload = payload.types.some(
      (el) => !InventoryExportTypeLabel[el]
    );

    if (inValidPayload) {
      return errorMessageResponse(MESSAGES.INVALID_EXPORT_TYPE);
    }

    const category = await dynamicCategoryRepository.find(payload.category_id);

    if (!category) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);
    }

    if (!category?.relation_id) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_BELONG_TO_BRAND);
    }

    const brand = await brandRepository.find(category.relation_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const inventory = (await this.getList(user, {
      category_id: payload.category_id,
    })) as unknown as {
      data: { inventories: InventoryListResponse[] };
    };

    if (!inventory?.data?.inventories?.length) {
      return errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND);
    }

    const unitTypes = await commonTypeRepository.getAllBy({
      type: COMMON_TYPES.INVENTORY_UNIT,
    });

    const currencies = uniq(
      inventory.data.inventories
        .map(
          (inven) =>
            orderBy(
              inven?.price?.exchange_histories || [],
              "created_at",
              "desc"
            )[0]?.to_currency ?? inven?.price?.currency
        )
        .filter(Boolean)
    );

    const currencySymbols = await exchangeCurrencyRepository.getBaseCurrencies(
      currencies
    );

    const data = this.convertInventoryArrayToCsv(
      payload.types,
      inventory.data.inventories.map((el) => {
        const rate = reduce(
          el.price.exchange_histories?.map((unit) => unit.rate),
          (acc, el) => acc * el,
          1
        );

        const unitPrice = Number(el?.price?.unit_price ?? 0) * rate;

        const currency =
          orderBy(el?.price?.exchange_histories || [], "created_at", "desc")[0]
            ?.to_currency ?? el?.price?.currency;

        return {
          ...el,
          currency_symbol:
            currencySymbols?.find((el) => el.code === currency)?.symbol ?? "",
          price: {
            ...el.price,
            unit_price: Number(unitPrice.toFixed(2)),
            currency,
            unit_type:
              unitTypes.find((type) => type.id === el.price.unit_type)?.name ??
              "",
          },
        };
      })
    );

    return successResponse({
      data,
      brand_name: brand.name,
      category_name: category.name,
    }) as ExportResponse;
  }

  private mappingUpdatedInventories(
    inventory: InventoryCreate,
    params: {
      currency: string;
      locations: LocationWithTeamCountAndFunctionType[];
      warehouses: (WarehouseEntity & { in_stock: number })[];
      user: UserAttributes;
      existedInventoryId: string;
      latestPrice?: LatestPrice;
    }
  ) {
    const {
      currency,
      locations,
      user,
      existedInventoryId,
      warehouses,
      latestPrice,
    } = params;

    const newExistedInventory: MappingInventory = {
      ...inventory,
      id: existedInventoryId,
      _type: "old",
    };

    if ("unit_price" in inventory) {
      const basePriceId = uuid();
      newExistedInventory.inventory_base_price_id = basePriceId;
      newExistedInventory.currency = currency;

      newExistedInventory.volume_prices = !latestPrice?.volume_prices?.length
        ? undefined
        : latestPrice.volume_prices.map((price) => ({
            ...price,
            discount_price: (inventory.unit_price * price.discount_rate) / 100,
            inventory_base_price_id: basePriceId,
          }));
    }

    if ("warehouses" in inventory) {
      const locationFromPayload = inventory.warehouses?.map(
        (el) => el.location_id
      );

      const inventoryWarehouses = this.findWarehouseByLocationId(
        locations.filter((el) => locationFromPayload?.includes(el.id)),
        warehouses,
        inventory.warehouses
      );

      newExistedInventory.inventory_ledgers = inventoryWarehouses.map((ws) =>
        pick(
          {
            ...ws,
            warehouse_id: ws.id,
            inventory_id: existedInventoryId,
            status: WarehouseStatus.ACTIVE,
            convert: 0,
          },
          ["status", "quantity", "warehouse_id", "inventory_id", "convert"]
        )
      ) as MultipleInventoryLedgerRequest[];

      newExistedInventory.inventory_actions = inventoryWarehouses.map((ws) =>
        pick(
          {
            ...ws,
            warehouse_id: ws.id,
            inventory_id: existedInventoryId,
            status: WarehouseStatus.ACTIVE,
            created_by: user.id,
          },
          ["quantity", "warehouse_id", "inventory_id", "created_by"]
        )
      );
    }

    return newExistedInventory;
  }

  private mappingCreatedInventories(
    inventory: InventoryCreate,
    params: {
      currency: string;
      user: UserAttributes;
      allWarehouses: any[];
    }
  ) {
    const { currency, allWarehouses, user } = params;
    const inventoryId = uuid();
    const basePriceId = uuid();

    const newInventory: MappingInventory = {
      ...inventory,
      _type: "new",
      id: inventoryId,
      currency: currency,
      inventory_base_price_id: basePriceId,
    };

    const allLedgers: MultipleInventoryLedgerRequest[] = [];
    const allActions: MultipleInventoryActionRequest[] = [];

    allWarehouses.forEach((ws: any) => {
      allLedgers.push({
        warehouse_id: ws.id,
        inventory_id: inventoryId,
        quantity: ws.type === WarehouseType.IN_STOCK ? ws.quantity : 0,
        convert: ws.type === WarehouseType.IN_STOCK ? ws?.convert ?? 0 : 0,
        type: ws.type,
        status: WarehouseStatus.ACTIVE,
      });

      allActions.push({
        warehouse_id: ws.id,
        inventory_id: inventoryId,
        quantity: ws.type === WarehouseType.IN_STOCK ? ws.quantity : 0,
        created_by: user.id,
      });
    });

    newInventory.inventory_actions = allActions;
    newInventory.inventory_ledgers = allLedgers;

    return newInventory;
  }

  private async mappingInventories(
    user: UserAttributes,
    brandInventories: InventoryEntity[],
    currency: string,
    inventories: InventoryCreate[]
  ) {
    const locations = await locationService.getList(user, {
      sort: "business_name",
      order: "ASC",
      functional_type: CompanyFunctionalGroup.LOGISTIC,
    });

    const logisticsLocationIds = locations.data.locations.map((el) => el.id);

    const existedWarehouses = await warehouseRepository.getBrandWarehouses(
      logisticsLocationIds,
      {
        status: WarehouseStatus.ACTIVE,
      }
    );

    const existedLocationIds = existedWarehouses.map((el) => el.location_id);

    const newWarehouses = locations.data.locations
      .filter((el) => !existedLocationIds.includes(el.id))
      .map((location) => {
        const newPhysicalWarehouseId = uuid();

        const physicalWarehouse = {
          id: newPhysicalWarehouseId,
          name: location.business_name,
          location_id: location.id,
          relation_id: user.relation_id,
          type: WarehouseType.IN_STOCK,
          status: WarehouseStatus.ACTIVE,
          parent_id: null,
        };

        const nonPhysicalWarehouses =
          warehouseService.nonPhysicalWarehouseTypes.map((type) => ({
            id: uuid(),
            name: type,
            location_id: location.id,
            relation_id: user.relation_id,
            type,
            status: WarehouseStatus.ACTIVE,
            parent_id: newPhysicalWarehouseId,
          }));

        return [physicalWarehouse, ...nonPhysicalWarehouses];
      })
      .flat() as WarehouseEntity[];

    const allWarehouses = existedWarehouses.concat(newWarehouses);

    const [warehouseInStocks, otherWarehouses] = partition(
      allWarehouses,
      (ws) => ws.type === WarehouseType.IN_STOCK
    );

    const skus = inventories.map((inven) => inven.sku.toLowerCase());
    const existedInventories = brandInventories.filter((inven) =>
      skus.includes(inven.sku.toLowerCase())
    );
    const existedInventoriesIds = existedInventories.map((inven) => inven.id);

    const ledgers = await inventoryLedgerRepository.findByInventories(
      existedInventoriesIds
    );

    const latestPrices = await inventoryRepository.getLatestPrices(
      existedInventoriesIds
    );

    const importedInventories: MappingInventory[] = inventories.map(
      (inventory) => {
        const existedInventory = brandInventories.find(
          (inven) => inven.sku.toLowerCase() === inventory.sku.toLowerCase()
        );

        if (existedInventory) {
          const inventoryLedgers = ledgers.filter(
            (el: any) => el.inventory_id === existedInventory.id
          );

          const inventoryWarehouses = warehouseInStocks.map((el) => ({
            ...el,
            in_stock:
              inventoryLedgers.find(
                (ledger: any) => ledger.warehouse_id === el.id
              )?.quantity ?? 0,
          }));

          return this.mappingUpdatedInventories(inventory, {
            currency,
            locations: locations.data.locations,
            warehouses: inventoryWarehouses,
            user,
            existedInventoryId: existedInventory.id,
            latestPrice: latestPrices.find(
              (el) => el.inventory_id === existedInventory.id
            ),
          });
        }

        const mappedInstockWarehouseQuantity = warehouseInStocks.map(
          (item, index) => ({
            ...item,
            quantity: inventory?.warehouses?.[index]?.quantity ?? 0,
          })
        );

        const createdInventory = this.mappingCreatedInventories(inventory, {
          currency,
          user,
          allWarehouses: otherWarehouses.concat(mappedInstockWarehouseQuantity),
        });

        return createdInventory;
      }
    );

    return partition(
      importedInventories,
      (inventory) => inventory._type === "old"
    );
  }

  private async updateMultipleInventories(inventories: MappingInventory[]) {
    const existedInventories = inventories.map((inven) =>
      pick(inven, ["sku", "on_order", "image", "back_order", "description"])
    ) as Omit<MultipleInventoryRequest, "id">[];

    const basePrices = inventories
      .map((inven) =>
        pick(
          {
            ...inven,
            inventory_id: inven.id,
            id: inven.inventory_base_price_id, // base price id
          },
          ["id", "unit_price", "unit_type", "currency", "inventory_id"]
        )
      )
      .filter(Boolean) as MultipleInventoryBasePriceRequest[];

    const volumePrices = inventories
      .map((inven) =>
        inven.volume_prices?.map((volume) =>
          pick(volume, [
            "discount_price",
            "discount_rate",
            "min_quantity",
            "max_quantity",
            "inventory_base_price_id", // base price id
          ])
        )
      )
      .flat()
      .filter(Boolean) as MultipleInventoryVolumePricePriceRequest[];

    const inventoryLedgers = inventories
      .map((inven) =>
        inven.inventory_ledgers?.map((ledger) =>
          pick(ledger, ["warehouse_id", "inventory_id", "quantity", "convert"])
        )
      )
      .flat()
      .filter((el) => el?.warehouse_id && el?.inventory_id) as Omit<
      MultipleInventoryLedgerRequest,
      "id"
    >[];

    const inventoryActions = inventories
      .map((inven) =>
        inven.inventory_actions?.map((action) =>
          pick(action, [
            "warehouse_id",
            "inventory_id",
            "quantity",
            "created_by",
          ])
        )
      )
      .flat()
      .filter(
        (el) => el?.warehouse_id && el?.inventory_id
      ) as MultipleInventoryActionRequest[];

    try {
      await this.updateMultiple(existedInventories);
    } catch (error) {
      console.log("error inventory.updateMultiple --->>>>>>>>>>>>>>>", error);
    }

    try {
      await inventoryBasePriceService.createMultiple(basePrices);
    } catch (error) {
      console.log(
        "error inventoryBasePriceService.createMultiple --->>>>>>>>>>>>>>>",
        error
      );
    }

    try {
      await inventoryVolumePriceService.createMultiple(volumePrices);
    } catch (error) {
      console.log(
        "error inventoryVolumePriceService.createMultiple --->>>>>>>>>>>>>>>",
        error
      );
    }

    try {
      await inventoryLedgerService.updateMultiple(inventoryLedgers);
    } catch (error) {
      console.log(
        "error inventoryLedgerService.updateMultiple --->>>>>>>>>>>>>>>",
        error
      );
    }

    try {
      await inventoryActionService.createMultiple(
        inventories[0].inventory_category_id,
        inventoryActions
      );
    } catch (error) {
      console.log(
        "error inventoryActionService.createMultiple --->>>>>>>>>>>>>>>",
        error
      );
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  private async createMultipleInventories(inventories: MappingInventory[]) {
    const newInventories = inventories.map((inven) =>
      pick(inven, [
        "id",
        "sku",
        "on_order",
        "image",
        "back_order",
        "description",
        "inventory_category_id",
      ])
    ) as MultipleInventoryRequest[];

    const basePrices = inventories
      .map((inven) =>
        pick(
          {
            ...inven,
            inventory_id: inven.id,
            id: inven.inventory_base_price_id,
          },
          ["id", "unit_price", "unit_type", "currency", "inventory_id"]
        )
      )
      .filter(
        (inven) => "unit_price" in inven && "unit_type" in inven
      ) as MultipleInventoryBasePriceRequest[];

    const inventoryLedgers = inventories
      .map((inven) => inven.inventory_ledgers)
      .flat() as MultipleInventoryLedgerRequest[];

    const inventoryActions = inventories
      .map((inven) => inven.inventory_actions)
      .flat()
      .filter((el) => el?.quantity !== 0) as MultipleInventoryActionRequest[];

    try {
      await inventoryActionService.createMultiple(
        inventories[0].inventory_category_id,
        inventoryActions
      );
    } catch (error) {
      console.log(
        "error inventoryActionService.createMultiple --->>>>>>>>>>>>>>>",
        error
      );
    }

    try {
      await inventoryLedgerService.createMultiple(inventoryLedgers);
    } catch (error) {
      console.log(
        "error inventoryLedgerService.createMultiple --->>>>>>>>>>>>>>>",
        error
      );
    }

    try {
      await inventoryBasePriceService.createMultiple(basePrices);
    } catch (error) {
      console.log(
        "error inventoryBasePriceService.createMultiple --->>>>>>>>>>>>>>>",
        error
      );
    }

    try {
      await this.createMultiple(newInventories);
    } catch (error) {
      console.log("error inventory.createMultiple --->>>>>>>>>>>>>>>", error);
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async updateMultiple(payload: Omit<MultipleInventoryRequest, "id">[]) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryUpdated = await inventoryRepository.updateMultiple(
      payload.map((item) => ({
        ...item,
        updated_at: getTimestamps(),
      }))
    );
    return inventoryUpdated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
  }

  public async createMultiple(payload: MultipleInventoryRequest[]) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryCreated = await inventoryRepository.createMultiple(
      payload.map((item) => ({
        ...item,
        created_at: getTimestamps(),
        updated_at: getTimestamps(),
      }))
    );
    return inventoryCreated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
  }

  public async import(user: UserAttributes, payload: InventoryCreate[]) {
    const existedBrand = await brandRepository.find(user.relation_id);

    if (!existedBrand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    const baseCurrency = await exchangeHistoryRepository.getLatestHistory(
      existedBrand.id
    );

    if (!baseCurrency) {
      return errorMessageResponse(MESSAGES.BASE_CURRENCY_NOT_FOUND, 404);
    }

    const brandInventories = await inventoryRepository.getAllInventoryByBrand(
      existedBrand.id
    );

    const unitTypes = await commonTypeRepository.getAllBy({
      type: COMMON_TYPES.INVENTORY_UNIT,
    });

    const [existedInventories, newInventories] = await this.mappingInventories(
      user,
      brandInventories,
      baseCurrency.to_currency,
      payload
    );

    if (existedInventories.length) {
      const errors: InventoryErrorList[] = this.validateImportPayload(
        brandInventories,
        unitTypes,
        payload
      );

      if (errors.length) {
        return errorMessageResponse(
          errors.map((el) => `${el.sku}: ${el.errors.join(" - ")}`).join(", "),
          400
        );
      }

      const existedInventoryChunks = chunk(
        existedInventories,
        IMPORT_CHUNK_SIZE
      );

      const updatedInventories = await Promise.all(
        existedInventoryChunks.map((inventories) => {
          const temp = this.updateMultipleInventories(inventories);

          return temp;
        })
      );

      const messageErrors = updatedInventories
        .filter((el) => el.statusCode !== 200)
        .map((el) => el.message);

      if (messageErrors.length) {
        return errorMessageResponse(messageErrors.join(", "));
      }
    }

    if (newInventories.length) {
      const errors = this.validateImportPayloadInsert(
        unitTypes,
        newInventories
      );

      if (errors.length) {
        return errorMessageResponse(MESSAGES.INVENTORY.INVALID_DATA_INSERT);
      }

      try {
        return this.createMultipleInventories(newInventories);
      } catch (error) {
        console.log("error --->>>>>>>>>>>>>>>", error);

        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
      } finally {
      }
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export const inventoryService = new InventoryService();
export default InventoryService;
