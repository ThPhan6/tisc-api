import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { inventoryRepository } from "@/repositories/inventory.repository";
import {
  uploadImagesInventory,
  validateImageType,
} from "@/services/image.service";
import { UserAttributes } from "@/types";
import { randomUUID } from "crypto";
import { pick } from "lodash";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import { InventoryCategoryQuery, InventoryCreate } from "./inventory.type";
import { getTimestamps } from "@/Database/Utils/Time";

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

  public async getInventoryCategoryListWithPagination(
    query: InventoryCategoryQuery
  ) {
    const invenList =
      await inventoryRepository.getInventoryCategoryListWithPagination(query);

    if (!invenList) {
      return errorMessageResponse(MESSAGES.NOT_FOUND);
    }

    return successResponse({
      ...invenList,
      message: MESSAGES.SUCCESS,
    });
  }

  public async create(
    user: UserAttributes,
    payload: Omit<InventoryCreate, "brand_id">
  ) {
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
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    let image: string = "";
    if (payload.image) {
      if (!(await validateImageType([payload.image]))) {
        return errorMessageResponse(MESSAGES.IMAGE_INVALID);
      }

      const uploadedImages = await uploadImagesInventory(
        [payload.image],
        brand.name,
        brand.id
      );
      image = uploadedImages?.[0];
    }

    const newInventory = await inventoryRepository.create({
      ...pick(payload, ["name", "description", "sku", "inventory_category_id"]),
      image,
      id: randomUUID(),
    });

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
    /// find inventory
    const invenExisted = await inventoryRepository.find(id);
    if (!invenExisted) {
      return errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND);
    }

    /// find category to get brand
    const category = await dynamicCategoryRepository.find(
      invenExisted.inventory_category_id
    );

    if (!category) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND);
    }

    /// find brand
    const brand = await brandRepository.find(category.relation_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    let image: string = "";
    if (payload.image) {
      if (!(await validateImageType([payload.image]))) {
        return errorMessageResponse(MESSAGES.IMAGE_INVALID);
      }

      const uploadedImages = await uploadImagesInventory(
        [payload.image],
        brand.name,
        brand.id
      );
      image = uploadedImages?.[0];
    }

    const updatedInventory = await inventoryRepository.update(id, {
      ...invenExisted,
      ...pick(payload, ["name", "description", "sku"]),
      image,
      updated_at: getTimestamps(),
    });

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
