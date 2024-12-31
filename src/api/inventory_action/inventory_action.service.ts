import { inventoryActionRepository } from "@/repositories/inventory_action.repository";
import { MultipleInventoryActionRequest } from "./inventory_action.type";
import {
  errorMessageResponse,
  successMessageResponse,
} from "@/helpers/response.helper";
import { MESSAGES } from "@/constants";
import { v4 as uuid } from "uuid";
import { getTimestamps } from "@/Database/Utils/Time";

class InventoryActionService {
  public async createMultiple(
    categoryId: string,
    payload: MultipleInventoryActionRequest[]
  ) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryCreated = await inventoryActionRepository.createMultiple(
      categoryId,
      payload.map((item) => ({
        ...item,
        id: uuid(),
        created_at: getTimestamps(),
        updated_at: getTimestamps(),
      }))
    );

    return inventoryCreated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
  }
}

export const inventoryActionService = new InventoryActionService();
export default InventoryActionService;
