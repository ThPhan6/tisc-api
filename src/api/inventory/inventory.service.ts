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
import { isNil, pick } from "lodash";
import { dynamicCategoryRepository } from "../dynamic_categories/dynamic_categories.repository";
import { InventoryCategoryQuery, InventoryCreate } from "./inventory.type";
import { getTimestamps } from "@/Database/Utils/Time";

class InventoryService {
  public async get(id?: string) {
    if (isNil(id)) {
      const data = await inventoryRepository.getAll();
      return successResponse({
        data,
        message: MESSAGES.SUCCESS,
      });
    }

    const inventory = await inventoryRepository.find(id);

    if (!inventory) {
      return errorMessageResponse(MESSAGES.NOT_FOUND, 404);
    }

    return successResponse({
      data: inventory,
      message: MESSAGES.SUCCESS,
    });
  }

  public async getInventoryCategoryListWithPagination(
    query: InventoryCategoryQuery
  ) {
    const inventoryList =
      await inventoryRepository.getInventoryCategoryListWithPagination(query);

    if (!inventoryList) {
      return errorMessageResponse(MESSAGES.NOT_FOUND, 404);
    }

    return successResponse({
      ...inventoryList,
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

    /// create inventory
    const newInventory = await inventoryRepository.create({
      ...pick(payload, [
        "name",
        "description",
        "sku",
        "inventory_category_id",
        "image",
      ]),
      id: randomUUID(),
    });

    if (!newInventory) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    /// upload image
    let image: string = "";
    if (payload.image) {
      if (!(await validateImageType([payload.image]))) {
        return errorMessageResponse(MESSAGES.IMAGE_INVALID);
      }

      const uploadedImages = await uploadImagesInventory(
        [payload.image],
        brand.name,
        newInventory.id
      );
      image = uploadedImages?.[0];
    }

    /// update image to database
    const inventoryUpdated = await this.update(user, newInventory.id, {
      image,
    });

    if (!inventoryUpdated) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    return successResponse({
      data: newInventory,
      message: MESSAGES.SUCCESS,
    });
  }

  public async update(
    user: UserAttributes,
    id: string,
    payload: Partial<InventoryCreate>
  ) {
    /// find inventory
    const inventoryExisted = await inventoryRepository.find(id);
    if (!inventoryExisted) {
      return errorMessageResponse(MESSAGES.INVENTORY_NOT_FOUND);
    }

    /// find category to get brand
    const category = await dynamicCategoryRepository.find(
      inventoryExisted.inventory_category_id
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

      const imageUploaded = await uploadImagesInventory(
        [payload.image],
        brand.name,
        inventoryExisted.id
      );
      image = imageUploaded?.[0];
    }

    const updatedInventory = await inventoryRepository.update(id, {
      ...inventoryExisted,
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
