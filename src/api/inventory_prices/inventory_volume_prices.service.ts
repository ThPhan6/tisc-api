import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { inventoryBasePriceRepository } from "@/repositories/inventory_base_prices.repository";
import { inventoryVolumePriceRepository } from "@/repositories/inventory_volume_prices.repository";
import { InventoryBasePriceEntity, InventoryVolumePriceEntity } from "@/types";
import { isEmpty } from "lodash";
import {
  InventoryVolumePrice,
  MultipleInventoryVolumePricePriceRequest,
} from "./inventory_volume_price.type";

class InventoryVolumePriceService {
  public async create(
    basePrice: InventoryBasePriceEntity,
    payload: Omit<
      InventoryVolumePrice,
      "id" | "created_at" | "inventory_base_price_id"
    >[]
  ) {
    if (isEmpty(payload)) {
      return {
        ...errorMessageResponse(
          MESSAGES.SOMETHING_WRONG_CREATE_INVENTORY_VOLUME_PRICE
        ),
        data: null,
      };
    }

    const result: InventoryVolumePriceEntity[] | undefined =
      await inventoryVolumePriceRepository.createMany(
        payload.map((item) => ({
          ...item,
          inventory_base_price_id: basePrice.id,
          discount_rate: item.discount_rate,
          discount_price: (basePrice.unit_price * item.discount_rate) / 100,
        })) as InventoryVolumePriceEntity[]
      );

    if (!result || result?.length === 0) {
      await inventoryBasePriceRepository.delete(basePrice.id);

      return {
        ...errorMessageResponse(
          MESSAGES.SOMETHING_WRONG_CREATE_INVENTORY_VOLUME_PRICE
        ),
        data: null,
      };
    }

    return successResponse({
      data: result,
      message: MESSAGES.SUCCESS,
    });
  }

  public async createMultiple(
    payload: MultipleInventoryVolumePricePriceRequest[]
  ) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryBasePriceCreated =
      await inventoryVolumePriceRepository.createMultiple(payload);

    return inventoryBasePriceCreated?.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
  }
}

export const inventoryVolumePriceService = new InventoryVolumePriceService();
export default InventoryVolumePriceService;
