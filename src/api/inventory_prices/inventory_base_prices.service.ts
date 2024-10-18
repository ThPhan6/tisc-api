import { MESSAGES } from "@/constants";
import { errorMessageResponse } from "@/helpers/response.helper";
import { inventoryBasePriceRepository } from "@/repositories/inventory_base_prices.repository";
import { InventoryBasePrice } from "./inventory_prices.type";

class InventoryBasePriceService {
  public async create(payload: Omit<InventoryBasePrice, "id" | "created_at">) {
    const result = await inventoryBasePriceRepository.create({
      ...payload,
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
      data: result,
      message: MESSAGES.SUCCESS,
      statusCode: 200,
    };
  }
}

export const inventoryBasePriceService = new InventoryBasePriceService();
export default InventoryBasePriceService;
