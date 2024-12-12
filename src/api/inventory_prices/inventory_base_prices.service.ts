import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
} from "@/helpers/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { exchangeHistoryRepository } from "@/repositories/exchange_history.repository";
import { inventoryRepository } from "@/repositories/inventory.repository";
import { inventoryBasePriceRepository } from "@/repositories/inventory_base_prices.repository";
import { isNil, reduce } from "lodash";
import {
  InventoryBasePriceRequest,
  MultipleInventoryBasePriceRequest,
} from "./inventory_prices.type";

class InventoryBasePriceService {
  public async create(payload: Partial<InventoryBasePriceRequest>) {
    if (!payload.relation_id || !payload.inventory_id) {
      return {
        ...errorMessageResponse(MESSAGES.SOMETHING_WRONG),
        data: null,
      };
    }

    const baseCurrency = await exchangeHistoryRepository.getLatestHistory(
      payload.relation_id
    );

    if (!baseCurrency) {
      return {
        ...errorMessageResponse(MESSAGES.BASE_CURRENCY_NOT_FOUND),
        data: null,
      };
    }

    const basePriceExisted =
      await inventoryBasePriceRepository.getLatestBasePriceByInventoryId(
        payload.inventory_id
      );

    const exchangeHistories =
      await inventoryRepository.getExchangeHistoryOfPrice(payload.inventory_id);

    const rate = reduce(
      exchangeHistories?.map((unit) => unit.rate),
      (acc, el) => acc * el,
      1
    );

    const unitPrice = !isNil(payload?.unit_price)
      ? payload.unit_price
      : basePriceExisted?.unit_price;

    const unitPriceWithRate = unitPrice / rate;

    if (isNil(unitPrice)) {
      return {
        ...errorMessageResponse(MESSAGES.PRICE_NOT_FOUND),
        data: null,
      };
    }

    if (!payload?.unit_type && !basePriceExisted?.unit_type) {
      return {
        ...errorMessageResponse(MESSAGES.UNIT_TYPE_NOT_FOUND),
        data: null,
      };
    }

    const unitType = await commonTypeRepository.find(
      payload?.unit_type ?? basePriceExisted?.unit_type
    );

    if (!unitType) {
      return {
        ...errorMessageResponse(MESSAGES.UNIT_TYPE_NOT_FOUND),
        data: null,
      };
    }

    const result = await inventoryBasePriceRepository.create({
      inventory_id: payload.inventory_id,
      unit_type: unitType.id,
      unit_price: unitPriceWithRate,
      currency: baseCurrency.to_currency,
    });

    if (!result) {
      return {
        ...errorMessageResponse(
          MESSAGES.SOMETHING_WRONG_CREATE_INVENTORY_BASE_PRICE
        ),
        data: null,
      };
    }

    return {
      ...successMessageResponse(MESSAGES.SUCCESS),
      data: result,
    };
  }

  public async createMultiple(payload: MultipleInventoryBasePriceRequest[]) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryBasePriceCreated =
      await inventoryBasePriceRepository.createMultiple(payload);

    return inventoryBasePriceCreated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
  }
}

export const inventoryBasePriceService = new InventoryBasePriceService();
export default InventoryBasePriceService;
