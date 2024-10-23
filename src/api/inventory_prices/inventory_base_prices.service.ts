import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
} from "@/helpers/response.helper";
import { exchangeHistoryRepository } from "@/repositories/exchange_history.repository";
import { inventoryBasePriceRepository } from "@/repositories/inventory_base_prices.repository";
import { InventoryBasePriceRequest } from "./inventory_prices.type";

class InventoryBasePriceService {
  public async create(payload: InventoryBasePriceRequest) {
    /// find the last currency
    const baseCurrency = await exchangeHistoryRepository.getLatestHistory(
      payload.relation_id
    );

    if (!baseCurrency) {
      return {
        ...errorMessageResponse(MESSAGES.BASE_CURRENCY_NOT_FOUND),
        data: null,
      };
    }

    const result = await inventoryBasePriceRepository.create({
      ...payload,
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
