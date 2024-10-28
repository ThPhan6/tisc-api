import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
} from "@/helpers/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { exchangeHistoryRepository } from "@/repositories/exchange_history.repository";
import { inventoryBasePriceRepository } from "@/repositories/inventory_base_prices.repository";
import { isNil, omit } from "lodash";
import { InventoryBasePriceRequest } from "./inventory_prices.type";

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

    const unitPrice = !isNil(payload.unit_price)
      ? payload.unit_price
      : basePriceExisted?.unit_price;

    if (isNil(unitPrice)) {
      return {
        ...errorMessageResponse(MESSAGES.PRICE_NOT_FOUND),
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
      unit_price: unitPrice,
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
}

export const inventoryBasePriceService = new InventoryBasePriceService();
export default InventoryBasePriceService;
