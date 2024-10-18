import { MESSAGES } from "@/constants";
import { errorMessageResponse } from "@/helpers/response.helper";
import { inventoryBasePriceRepository } from "@/repositories/inventory_base_prices.repository";
import { inventoryVolumePriceRepository } from "@/repositories/inventory_volume_prices.repository";
import { InventoryVolumePriceEntity } from "@/types";
import { InventoryVolumePrice } from "./inventory_prices.type";
import { isNumber, omit } from "lodash";

class InventoryVolumePriceService {
  private calculateDiscountRate(
    basePrice: number,
    discountPrice: number
  ): number {
    return (discountPrice / basePrice) * 100;
  }

  public async create(
    payload: Omit<InventoryVolumePrice, "id" | "created_at">[]
  ) {
    if (
      payload.length === 0 ||
      payload.some((item) => !item.inventory_base_price_id)
    ) {
      return {
        data: null,
        message:
          "No data to create or some data is missing inventory base price id",
        statusCode: 200,
      };
    }

    const result = await inventoryVolumePriceRepository.createMany(
      payload.map((item) => {
        return {
          ...omit(item, ["base_price"]),
          discount_price: isNumber(item.discount_price)
            ? item.discount_price
            : null,
          discount_rate: isNumber(item.discount_price)
            ? this.calculateDiscountRate(item.base_price, item.discount_price)
            : null,
        };
      }) as InventoryVolumePriceEntity[]
    );

    /// SOMETHING_WRONG_CREATE_INVENTORY_VOLUME_PRICE
    if (!result) {
      /// delete inventory base price
      const inventoryBasePriceId = payload.map(
        (item) => item.inventory_base_price_id
      )?.[0];

      if (inventoryBasePriceId) {
        await inventoryBasePriceRepository.delete(inventoryBasePriceId);
      }

      return {
        ...errorMessageResponse(
          MESSAGES.SOMETHING_WRONG_CREATE_INVENTORY_VOLUME_PRICE
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

export const inventoryVolumePriceService = new InventoryVolumePriceService();
export default InventoryVolumePriceService;
