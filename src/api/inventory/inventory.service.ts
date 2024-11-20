import { MESSAGES } from "@/constants";
import { getTimestamps } from "@/Database/Utils/Time";
import {
  jsonToCSV,
  REGEX_ORDER,
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
import { IExchangeCurrency, UserAttributes, WarehouseStatus } from "@/types";
import { randomUUID } from "crypto";
import {
  forEach,
  isEmpty,
  isNil,
  isString,
  lastIndexOf,
  map,
  omit,
  pick,
  sortBy,
  sumBy,
  uniqBy,
} from "lodash";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import { ExchangeCurrencyRequest } from "../exchange_history/exchange_history.type";
import { inventoryBasePriceService } from "../inventory_prices/inventory_base_prices.service";
import { InventoryVolumePrice } from "../inventory_prices/inventory_prices.type";
import { inventoryVolumePriceService } from "../inventory_prices/inventory_volume_prices.service";
import { warehouseService } from "../warehouses/warehouse.service";
import {
  WarehouseListResponse,
  WarehouseResponse,
} from "../warehouses/warehouse.type";
import {
  InventoryCategoryQuery,
  InventoryCreate,
  InventoryErrorList,
  InventoryExportRequest,
  InventoryExportType,
  InventoryExportTypeLabel,
  InventoryListRequest,
  InventoryListResponse,
} from "./inventory.type";

class InventoryService {
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
        unit_price: item.price.unit_price,
        unit_type: item.price.unit_type,
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

    return jsonToCSV(
      contentFlat.map((el) => {
        const newEl: any = {};

        forEach(
          sortObjectByKey(el, [
            "sku",
            "description",
            "unit_price",
            "unit_type",
            "total_stock",
            "stock_value",
            "out_stock",
            "on_order",
            "back_order",
          ]),
          (value, key) => {
            if (headerSelected.includes(key.replace(REGEX_ORDER, ""))) {
              newEl[key] = value;
            }
          }
        );

        return newEl;
      })
    );
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

  private async validateImportPayload(payload: InventoryCreate[]) {
    let errors: InventoryErrorList[] = [];

    const inventories = await inventoryRepository.getAll();
    const existedSKU = inventories.map((el) => el.sku.toLowerCase());

    payload.forEach((item) => {
      if (existedSKU.includes(item.sku.toLowerCase())) {
        errors = this.pushErrorMessages(
          errors,
          item,
          MESSAGES.INVENTORY.SKU_EXISTED
        );
      }

      if (!isEmpty(item?.volume_prices)) {
        if (!this.isValidVolumePrices(item.volume_prices as any)) {
          errors = this.pushErrorMessages(
            errors,
            item,
            MESSAGES.INVENTORY.INVALID_VOLUME_PRICES
          );
        }
      }

      if (item.on_order && item.on_order < 0) {
        errors = this.pushErrorMessages(
          errors,
          item,
          MESSAGES.INVENTORY.ON_ORDER_LESS_THAN_ZERO
        );
      }

      if (item.back_order && item.back_order < 0) {
        errors = this.pushErrorMessages(
          errors,
          item,
          MESSAGES.INVENTORY.BACK_ORDER_LESS_THAN_ZERO
        );
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

  public async getList(query: InventoryCategoryQuery) {
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
          newInventory.id,
          WarehouseStatus.ACTIVE
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

  public async create(payload: InventoryCreate) {
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

    const inventories = await inventoryRepository.getAll();
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

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async update(
    user: UserAttributes,
    id: string,
    payload: Partial<InventoryCreate>
  ) {
    /// find inventory
    const inventoryExisted = await inventoryRepository.find(id);
    if (!inventoryExisted) {
      return errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND, 404);
    }

    if ("sku" in payload) {
      const inventories = await inventoryRepository.getAll();
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
      on_order: payload.on_order ?? inventoryExisted.on_order,
      back_order: payload.back_order ?? inventoryExisted.back_order,
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
      const uniqueLocationIds = uniqBy(payload.warehouses, "location_id");
      const count = uniqueLocationIds.length;

      if (count !== payload?.warehouses?.length) {
        return errorMessageResponse("Warehouse duplicate location");
      }

      const payloadWarehouseLocationIds = payload.warehouses.map(
        (el) => el.location_id
      );

      const instockWarehouseActive = (await warehouseService.getList(
        id,
        WarehouseStatus.ACTIVE
      )) as unknown as {
        data: WarehouseListResponse;
      };

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
        payload.warehouses.map(async (ws) => {
          return await warehouseService.create(user, {
            inventory_id: id,
            location_id: ws.location_id,
            quantity: ws.quantity,
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

  public async createMultiple(payload: InventoryCreate[]) {
    const errors: InventoryErrorList[] = await this.validateImportPayload(
      payload
    );

    if (errors.length) {
      return errorMessageResponse(
        errors.map((el) => `${el.sku}: ${el.errors.join(" - ")}`).join(", "),
        400
      );
    }

    const newInventories = await Promise.all(
      payload.map(
        async (inventory) => await this.create(omit(inventory, "image"))
      )
    );

    if (newInventories.some((el) => el.statusCode !== 200)) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async export(payload: InventoryExportRequest) {
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

    const inventory = (await this.getList({
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
      inventory.data.inventories.map((el) => ({
        ...el,
        price: {
          ...el.price,
          unit_type:
            unitTypes.find((type) => type.id === el.price.unit_type)?.name ??
            "",
        },
      }))
    );

    return successResponse({ data });
  }
}

export const inventoryService = new InventoryService();
export default InventoryService;
