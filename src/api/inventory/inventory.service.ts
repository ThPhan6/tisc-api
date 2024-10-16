import { MESSAGES } from "@/constants";
import { getFullTime } from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { inventoryRepository } from "@/repositories/inventory.repository";
import { uploadImagesProduct } from "@/services/image.service";
import { InventoryEntity, UserAttributes } from "@/types";
import { randomUUID } from "crypto";
import { omit } from "lodash";
import { InventoryCreate } from "./inventory.type";

class InventoryService {
  public async get(id: string) {
    const inventory = await inventoryRepository.find(id);

    if (!inventory) {
      return errorMessageResponse(MESSAGES.NOT_FOUND);
    }

    return successResponse({
      data: inventory,
      message: MESSAGES.SUCCESS,
    });
  }

  public async getByCategoryId(id: string) {
    const inventories = await inventoryRepository.getAllBy({
      inventory_category_id: id,
    });

    if (!inventories) {
      return errorMessageResponse(MESSAGES.NOT_FOUND);
    }

    return successResponse({
      data: inventories,
      message: MESSAGES.SUCCESS,
    });
  }

  public async create(user: UserAttributes, payload: InventoryCreate) {
    const brand = await brandRepository.find(payload.brand_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const uploadedImages = await uploadImagesProduct(
      [payload.image],
      brand.name,
      brand.id
    );

    const inventoryData: InventoryEntity = {
      ...omit(payload, ["brand_id", "image"]),
      image: uploadedImages?.[0] ?? "",
      id: randomUUID(),
      created_at: getFullTime(),
      deleted_at: null,
      updated_at: null,
    };

    const newInventory = await inventoryRepository.create(inventoryData);

    if (!newInventory) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    return successResponse({
      data: newInventory,
      message: MESSAGES.SUCCESS,
    });
  }

  public async update(
    user: UserAttributes,
    id: string,
    payload: InventoryCreate
  ) {
    const brand = await brandRepository.find(payload.brand_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const uploadedImages = await uploadImagesProduct(
      [payload.image],
      brand.name,
      brand.id
    );

    const inventoryData: Partial<InventoryEntity> = {
      ...omit(payload, ["brand_id", "image"]),
      image: uploadedImages?.[0] ?? "",
      updated_at: getFullTime(),
    };

    const updatedInventory = await inventoryRepository.update(
      id,
      inventoryData
    );

    if (!updatedInventory) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    return successResponse({
      data: updatedInventory,
      message: MESSAGES.SUCCESS,
    });
  }

  public async delete(id: string) {
    const inventory = await inventoryRepository.find(id);

    if (!inventory) {
      return errorMessageResponse(MESSAGES.NOT_FOUND);
    }

    const deletedInventory = await inventoryRepository.delete(id);

    if (!deletedInventory) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    return successResponse({
      message: MESSAGES.SUCCESS,
    });
  }
}

export const inventoryService = new InventoryService();
export default InventoryService;
