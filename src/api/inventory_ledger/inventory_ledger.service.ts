import { inventoryLedgerRepository } from "@/repositories/inventory_ledger.repository";
import { MultipleInventoryLedgerRequest } from "./inventory_ledger.type";
import {
  errorMessageResponse,
  successMessageResponse,
} from "@/helpers/response.helper";
import { MESSAGES } from "@/constants";

class InventoryLedgerService {
  public async updateMultiple(
    payload: Omit<MultipleInventoryLedgerRequest, "id">[]
  ) {
    if (!payload.length) return successMessageResponse(MESSAGES.SUCCESS);

    const inventoryLedgerUpdated =
      await inventoryLedgerRepository.updateMultiple(payload);

    return inventoryLedgerUpdated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
  }

  public async createMultiple(payload: MultipleInventoryLedgerRequest[]) {
    const inventoryLedgerCreated =
      await inventoryLedgerRepository.createMultiple(payload);

    return inventoryLedgerCreated.length === payload.length
      ? successMessageResponse(MESSAGES.SUCCESS)
      : errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
  }
}

export const inventoryLedgerService = new InventoryLedgerService();
export default InventoryLedgerService;
