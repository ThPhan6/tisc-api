import { MESSAGES } from "@/constants";
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
import { deleteFile } from "@/services/aws.service";
import {
  uploadImagesInventory,
  validateImageType,
} from "@/services/image.service";
import {
  CompanyFunctionalGroup,
  IExchangeCurrency,
  InventoryEntity,
  LocationWithTeamCountAndFunctionType,
  UserAttributes,
  WarehouseEntity,
  WarehouseStatus,
  WarehouseType,
} from "@/types";
import { randomUUID } from "crypto";
import {
  forEach,
  isEmpty,
  isNil,
  isString,
  lastIndexOf,
  map,
  omit,
  partition,
  pick,
  reduce,
  sortBy,
  sumBy,
  uniqBy,
} from "lodash";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import { ExchangeCurrencyRequest } from "../exchange_history/exchange_history.type";
import { MultipleInventoryActionRequest } from "../inventory_action/inventory_action.type";
import { MultipleInventoryLedgerRequest } from "../inventory_ledger/inventory_ledger.type";
import { inventoryBasePriceService } from "../inventory_prices/inventory_base_prices.service";
import {
  InventoryBasePrice,
  MultipleInventoryBasePriceRequest,
} from "../inventory_prices/inventory_prices.type";
import {
  InventoryVolumePrice,
  MultipleInventoryVolumePricePriceRequest,
} from "../inventory_prices/inventory_volume_price";
import { inventoryVolumePriceService } from "../inventory_prices/inventory_volume_prices.service";
import { locationService } from "../location/location.service";
import { warehouseService } from "../warehouses/warehouse.service";
import {
  MultipleWarehouseRequest,
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
  MappingInventory,
  MultipleInventoryRequest,
} from "./inventory.type";
import { inventoryLedgerService } from "../inventory_ledger/inventory_ledger.service";
import { inventoryActionService } from "../inventory_action/inventory_action.service";

class InventoryService {
  private transferInventory = (inventory: Record<string, any>) => {
    const newInventory = { ...inventory };

    for (const key in inventory) {
      if (key.startsWith("#") && key.includes("Vol. Discount Price & Qty")) {
        const index = key.split(" ")[0];

        const discountPriceKey = `${index} Vol. Discount Price & Qty`;
        const minQtyKey = `${index} Vol. Min. Qty`;
        const maxQtyKey = `${index} Vol. Max. Qty`;

        const priceAndQty = `"${inventory[discountPriceKey]}, ${inventory[minQtyKey]}-${inventory[maxQtyKey]}"`;

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
        renameKeys(newEl, [...changedKeys, { sku: "Product ID" }])
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
                newContent[`#${idx + 1}_${key}`] = price;
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

  private async findWarehouseByLocationIndex(
    user: UserAttributes,
    locations: LocationWithTeamCountAndFunctionType[],
    warehouses?: Omit<InventoryWarehouse, "location_id">[],
    inventoryId?: string
  ) {
    let existedWarehouse:
      | { data: WarehouseListResponse; statusCode: number }
      | undefined = undefined;

    if (inventoryId) {
      existedWarehouse = (await warehouseService.getList(user, inventoryId, {
        status: WarehouseStatus.ACTIVE,
        type: WarehouseType.IN_STOCK,
      })) as {
        data: WarehouseListResponse;
        statusCode: number;
      };
    }

    const newWarehouses = locations.map((location, locationIdx) => {
      const warehouse = warehouses?.find((ws) => ws.index === locationIdx);
      const existedWarehouseLocation = existedWarehouse?.data?.warehouses?.find(
        (_ws, wsIdx) => wsIdx === warehouse?.index
      );

      if (warehouse) {
        return {
          ...omit(existedWarehouseLocation, ["in_stock"]),
          name: location.business_name,
          location_id: location.id,
          quantity: warehouse.quantity,
        };
      }

      return {
        ...omit(existedWarehouseLocation, ["in_stock"]),
        name: location.business_name,
        location_id: location.id,
        quantity: existedWarehouseLocation?.in_stock ?? 0,
      };
    });

    return newWarehouses;
  }

  private async validateImportPayload(
    existedInventories: InventoryEntity[],
    inventories: InventoryCreate[]
  ) {
    let errors: InventoryErrorList[] = [];

    await Promise.all(
      inventories.map(async (inventory) => {
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

        if ("unit_type" in inventory) {
          const unitType = await commonTypeRepository.find(inventory.unit_type);

          if (!unitType) {
            errors = this.pushErrorMessages(
              errors,
              inventory,
              MESSAGES.UNIT_TYPE_NOT_FOUND
            );
          }
        }
      })
    );

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
      const warehouses = await Promise.all(
        warehouseDeleted.map(
          async (ws) => await warehouseService.delete(user, ws.location_id)
        )
      );

      res.push(...warehouses);
    }

    /// create new warehouse and update warehouse existed
    const warehouseUpdated = await Promise.all(
      warehouses.map(async (ws) => {
        return await warehouseService.create(user, {
          inventory_id: inventoryId,
          location_id: ws.location_id,
          quantity: ws.quantity,
          convert: ws.convert,
        });
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
    const inventoryList = await inventoryRepository.getList(query);
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

    const baseCurrency =
      (await exchangeCurrencyRepository.getBaseCurrency()) as IExchangeCurrency[];

    if (!baseCurrency) {
      return errorMessageResponse(MESSAGES.BASE_CURRENCY_NOT_FOUND, 404);
    }

    const exchangeHistory = await exchangeHistoryRepository.getLatestHistory(
      brandId
    );

    if (!exchangeHistory) {
      return errorMessageResponse(MESSAGES.EXCHANGE_HISTORY_NOT_FOUND, 404);
    }

    const totalProduct = await inventoryRepository.getTotalInventories(brandId);

    const totalStock = await inventoryRepository.getTotalStockValue(brandId);

    return successResponse({
      data: {
        currencies: baseCurrency.map((el) => ({
          ...pick(el, ["code", "name"]),
        })),
        exchange_history: exchangeHistory,
        total_product: totalProduct,
        total_stock: totalStock,
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

    const inventoryId = randomUUID();

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

    const unitTypes = await commonTypeRepository.getAll();

    const data = this.convertInventoryArrayToCsv(
      payload.types,
      inventory.data.inventories.map((el) => {
        const rate = reduce(
          el.price.exchange_histories?.map((unit) => unit.rate),
          (acc, el) => acc * el,
          1
        );

        const unitPrice = Number(el?.price?.unit_price ?? 0) * rate;

        return {
          ...el,
          price: {
            ...el.price,
            unit_price: Number(unitPrice.toFixed(2)),
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

  private async mappingUpdatedInventories(
    inventory: InventoryCreate,
    params: {
      currency: string;
      locations: LocationWithTeamCountAndFunctionType[];
      user: UserAttributes;
      existedInventoryId: string;
    }
  ) {
    const { currency, locations, user, existedInventoryId } = params;

    const newExistedInventory: MappingInventory = {
      ...inventory,
      id: existedInventoryId,
      _type: "old",
    };

    if ("unit_price" in inventory) {
      const basePriceId = randomUUID();
      newExistedInventory.inventory_base_price_id = basePriceId;
      newExistedInventory.currency = currency;

      const latestPrice = await inventoryRepository.getLatestPrice(
        existedInventoryId
      );

      newExistedInventory.volume_prices = !latestPrice?.volume_prices?.length
        ? undefined
        : latestPrice.volume_prices.map((price) => ({
            ...price,
            discount_price: (inventory.unit_price * price.discount_rate) / 100,
            inventory_base_price_id: basePriceId,
          }));
    }

    if ("warehouses" in inventory) {
      newExistedInventory.warehouses = await this.findWarehouseByLocationIndex(
        user,
        locations,
        inventory.warehouses,
        existedInventoryId
      );

      newExistedInventory.inventory_ledgers =
        newExistedInventory.warehouses.map((ws) =>
          pick(
            {
              ...ws,
              warehouse_id: ws.id as string,
              inventory_id: existedInventoryId,
              status: WarehouseStatus.ACTIVE,
              convert: ws?.convert ?? 0,
            },
            ["status", "quantity", "warehouse_id", "inventory_id", "convert"]
          )
        );

      newExistedInventory.inventory_actions =
        newExistedInventory.warehouses.map((ws) =>
          pick(
            {
              ...ws,
              warehouse_id: ws.id as string,
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

  private async mappingCreatedInventories(
    inventory: InventoryCreate,
    params: {
      currency: string;
      locations: LocationWithTeamCountAndFunctionType[];
      user: UserAttributes;
    }
  ) {
    const { currency, locations, user } = params;
    const inventoryId = randomUUID();
    const basePriceId = randomUUID();

    const newInventory: MappingInventory = {
      ...inventory,
      _type: "new",
      id: inventoryId,
      currency: currency,
      inventory_base_price_id: basePriceId,
    };

    const warehouses = await this.findWarehouseByLocationIndex(
      user,
      locations,
      inventory.warehouses
    );

    const allWarehouses: MultipleWarehouseRequest[] = [];
    const allLedgers: MultipleInventoryLedgerRequest[] = [];
    const allActions: MultipleInventoryActionRequest[] = [];

    warehouses.forEach((ws) => {
      const warehouseId = randomUUID();
      const warehouseInStockId = randomUUID();
      const warehouseBackOrderId = randomUUID();
      const warehouseOnOrderId = randomUUID();
      const warehouseDoneId = randomUUID();

      allWarehouses.push({
        id: warehouseId,
        name: ws.name,
        type: WarehouseType.PHYSICAL,
        status: WarehouseStatus.ACTIVE,
        location_id: ws.location_id,
        relation_id: user.relation_id,
        quantity: 0,
        parent_id: null,
      });

      warehouseService.nonPhysicalWarehouseTypes.forEach((type) => {
        allWarehouses.push({
          id:
            type === WarehouseType.IN_STOCK
              ? warehouseInStockId
              : type === WarehouseType.BACK_ORDER
              ? warehouseBackOrderId
              : type === WarehouseType.ON_ORDER
              ? warehouseOnOrderId
              : warehouseDoneId,
          type,
          name: ws.name,
          status: WarehouseStatus.ACTIVE,
          location_id: ws.location_id,
          relation_id: user.relation_id,
          quantity: type === WarehouseType.IN_STOCK ? ws.quantity : 0,
          parent_id: warehouseId,
        });
      });
    });

    allWarehouses.forEach((ws) => {
      allLedgers.push({
        warehouse_id: ws.id,
        inventory_id: inventoryId,
        quantity: ws.type === WarehouseType.IN_STOCK ? ws.quantity : 0,
        convert: ws.type === WarehouseType.IN_STOCK ? ws?.convert ?? 0 : 0,
      });

      allActions.push({
        warehouse_id: ws.id,
        inventory_id: inventoryId,
        quantity: ws.type === WarehouseType.IN_STOCK ? ws.quantity : 0,
        created_by: user.id,
      });
    });

    newInventory.warehouses = allWarehouses;
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

    const importedInventories: MappingInventory[] = await Promise.all(
      inventories.map(async (inventory) => {
        const existedInventory = brandInventories.find(
          (inven) => inven.sku.toLowerCase() === inventory.sku.toLowerCase()
        );

        if (existedInventory) {
          return await this.mappingUpdatedInventories(inventory, {
            currency,
            locations: locations.data.locations,
            user,
            existedInventoryId: existedInventory.id,
          });
        }

        return await this.mappingCreatedInventories(inventory, {
          currency,
          locations: locations.data.locations,
          user,
        });
      })
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

    await this.updateMultiple(existedInventories);
    await inventoryBasePriceService.createMultiple(basePrices);
    await inventoryVolumePriceService.createMultiple(volumePrices);
    await inventoryLedgerService.updateMultiple(inventoryLedgers);
    await inventoryActionService.createMultiple(inventoryActions);

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

    const warehouses = inventories
      .map((inven) => inven.warehouses)
      .flat() as MultipleWarehouseRequest[];

    const inventoryLedgers = inventories
      .map((inven) => inven.inventory_ledgers)
      .flat() as MultipleInventoryLedgerRequest[];

    const inventoryActions = inventories
      .map((inven) => inven.inventory_actions)
      .flat() as MultipleInventoryActionRequest[];

    await this.createMultiple(newInventories);
    await inventoryBasePriceService.createMultiple(basePrices);
    await warehouseService.createMultiple(warehouses);
    await inventoryLedgerService.createMultiple(inventoryLedgers);
    await inventoryActionService.createMultiple(inventoryActions);

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async updateMultiple(payload: Omit<MultipleInventoryRequest, "id">[]) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryUpdated = await inventoryRepository.updateMultiple(payload);
    return inventoryUpdated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
  }

  public async createMultiple(payload: MultipleInventoryRequest[]) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryCreated = await inventoryRepository.createMultiple(payload);
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

    const errors: InventoryErrorList[] = await this.validateImportPayload(
      brandInventories,
      payload
    );

    if (errors.length) {
      return errorMessageResponse(
        errors.map((el) => `${el.sku}: ${el.errors.join(" - ")}`).join(", "),
        400
      );
    }

    const [existedInventories, newInventories] = await this.mappingInventories(
      user,
      brandInventories,
      baseCurrency.to_currency,
      payload
    );

    if (existedInventories.length) {
      const updatedInventories = await this.updateMultipleInventories(
        existedInventories
      );

      if (updatedInventories.statusCode !== 200) {
        return errorMessageResponse(updatedInventories.message);
      }
    }

    if (newInventories.length) {
      const createdInventories = await this.createMultipleInventories(
        newInventories
      );

      if (createdInventories.statusCode !== 200) {
        return errorMessageResponse(createdInventories.message);
      }
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export const inventoryService = new InventoryService();
export default InventoryService;
