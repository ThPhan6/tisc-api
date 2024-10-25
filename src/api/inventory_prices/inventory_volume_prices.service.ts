import { MESSAGES } from "@/constants";
import { errorMessageResponse } from "@/helpers/response.helper";
import { inventoryBasePriceRepository } from "@/repositories/inventory_base_prices.repository";
import { inventoryVolumePriceRepository } from "@/repositories/inventory_volume_prices.repository";
import { InventoryVolumePriceEntity } from "@/types";
import { omit } from "lodash";
import { InventoryVolumePrice } from "./inventory_prices.type";

class InventoryVolumePriceService {
  private calculateDiscountPrice(
    basePrice: number,
    discountPercent: number
  ): number {
    return (basePrice * discountPercent) / 100;
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
    const result: InventoryVolumePriceEntity[] | undefined =
      await inventoryVolumePriceRepository.createMany(
        payload.map((item) => {
          const basePrice = item.base_price;
          return {
            ...omit(item, ["base_price"]),
            discount_rate: item.discount_rate,
            discount_price: this.calculateDiscountPrice(
              basePrice,
              item.discount_rate
            ),
          };
        }) as InventoryVolumePriceEntity[]
      );

    /// SOMETHING_WRONG_CREATE_INVENTORY_VOLUME_PRICE
    if (!result || result.length === 0) {
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
