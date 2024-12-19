import { MESSAGES } from "@/constants";
import { getTimestamps } from "@/Database/Utils/Time";
import {
  errorMessageResponse,
  successMessageResponse,
} from "@/helpers/response.helper";
import { inventoryLedgerRepository } from "@/repositories/inventory_ledger.repository";
import { v4 as uuid } from "uuid";
import { MultipleInventoryLedgerRequest } from "./inventory_ledger.type";

class InventoryLedgerService {
  public async updateMultiple(
    payload: Omit<MultipleInventoryLedgerRequest, "id">[]
  ) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryLedgerUpdated =
      await inventoryLedgerRepository.updateMultiple(
        payload.map((el) => ({ ...el, updated_at: getTimestamps() }))
      );

    return inventoryLedgerUpdated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
  }

  public async createMultiple(payload: MultipleInventoryLedgerRequest[]) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryLedgerCreated =
      await inventoryLedgerRepository.createMultiple(
        payload.map((item) => ({
          ...item,
          id: uuid(),
          created_at: getTimestamps(),
          updated_at: getTimestamps(),
        }))
      );

    return inventoryLedgerCreated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
  }
}

export const inventoryLedgerService = new InventoryLedgerService();
export default InventoryLedgerService;
