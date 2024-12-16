import { inventoryActionRepository } from "@/repositories/inventory_action.repository";
import { MultipleInventoryActionRequest } from "./inventory_action.type";
import {
  errorMessageResponse,
  successMessageResponse,
} from "@/helpers/response.helper";
import { MESSAGES } from "@/constants";
import { randomUUID } from "crypto";
import { getTimestamps } from "@/Database/Utils/Time";

class InventoryActionService {
  public async createMultiple(payload: MultipleInventoryActionRequest[]) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryCreated = await inventoryActionRepository.createMultiple(
      payload.map((item) => ({
        ...item,
        id: randomUUID(),
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
