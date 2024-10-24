import { MESSAGES } from "@/constants";
import { getTimestamps } from "@/Database/Utils/Time";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { exchangeCurrencyRepository } from "@/repositories/exchange_currency.repository";
import { exchangeHistoryRepository } from "@/repositories/exchange_history.repository";
import { inventoryRepository } from "@/repositories/inventory.repository";
import { deleteFile } from "@/services/aws.service";
import {
  uploadImagesInventory,
  validateImageType,
} from "@/services/image.service";
import {
  EBaseCurrency,
  IExchangeCurrency,
  InventoryBasePriceEntity,
  InventoryVolumePriceEntity,
  UserAttributes,
} from "@/types";
import { randomUUID } from "crypto";
import { isEmpty, isNil, isNumber, pick } from "lodash";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import { ExchangeCurrencyRequest } from "../exchange_history/exchange_history.type";
import { inventoryBasePriceService } from "../inventory_prices/inventory_base_prices.service";
import { inventoryVolumePriceService } from "../inventory_prices/inventory_volume_prices.service";
import { InventoryCategoryQuery, InventoryCreate } from "./inventory.type";

class InventoryService {
  private async createInventoryPrices(
    inventoryId: string,
    brandId: string,
    payload: Partial<
      Pick<InventoryCreate, "unit_price" | "unit_type" | "volume_prices">
    >
  ) {
    const { unit_price = -1, unit_type = "", volume_prices = [] } = payload;

    if (
      !inventoryId ||
      isNil(unit_price) ||
      !isNumber(unit_price) ||
      (isNumber(unit_price) && unit_price <= 0) ||
      isEmpty(unit_type)
    ) {
      return;
    }

    /// create base price
    const basePrice = await inventoryBasePriceService.create({
      unit_price,
      unit_type,
      inventory_id: inventoryId,
      relation_id: brandId,
    });

    if (!basePrice.data) {
      return;
    }

    /// create volume prices
    const volumePrices = await inventoryVolumePriceService.create(
      volume_prices.map((item) => ({
        ...item,
        inventory_base_price_id: basePrice.data.id,
        base_price: basePrice.data.unit_price,
      }))
    );

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
        ...inventory,
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

    ///!ERROR
    // if (inventoryList.data.some((el) => isEmpty(el.price))) {
    //   console.log(
    //     inventoryList.data.filter((el) => (isEmpty(el.price) ))
    //   );

    //   console.log("ERROR Inventory -> get list -> Some inventory has no price");
    // }

    return successResponse({
      data: {
        inventories: inventoryList.data.map((el) => ({
          ...el,
          price: isEmpty(el?.price)
            ? null
            : {
                ...el.price,
                exchange_histories: el.price?.exchange_histories?.length
                  ? el.price.exchange_histories
                  : null,
                volume_prices: el.price?.volume_prices?.length
                  ? el.price.volume_prices
                  : null,
              },
        })),
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

  public async exchange(
    user: UserAttributes,
    payload: ExchangeCurrencyRequest
  ) {
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

    const inventoryId = randomUUID();

    /// upload image
    let image: string = "";
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
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    /// create inventory
    const newInventory = await inventoryRepository.create({
      ...pick(payload, ["description", "sku", "inventory_category_id"]),
      image,
      id: inventoryId,
    });

    if (!newInventory) {
      ///TODO: delete base price, volume prices and image

      /// delete image
      deleteFile(image);

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

    let image: string = inventoryExisted.image;
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
    if (!isNil(payload.unit_price) && !isNil(payload.unit_type)) {
      const inventoryPrice = await this.createInventoryPrices(
        inventoryExisted.id,
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
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
      }
    }

    /// update inventory
    const updatedInventory = await inventoryRepository.update(id, {
      ...inventoryExisted,
      ...pick(payload, "description", "sku"),
      image,
      updated_at: getTimestamps(),
    });

    if (!updatedInventory) {
      ///TODO: delete base price, volume prices and image

      /// delete image
      deleteFile(image);

      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    return successMessageResponse(MESSAGES.SUCCESS);
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
}

export const inventoryService = new InventoryService();
export default InventoryService;
