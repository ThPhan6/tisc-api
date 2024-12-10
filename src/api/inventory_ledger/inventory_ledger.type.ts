import { InventoryLedgerEntity } from "@/types";

export interface MultipleInventoryLedgerRequest
  extends Pick<
    InventoryLedgerEntity,
    "id" | "inventory_id" | "warehouse_id" | "quantity" | "status"
  > {}

export interface MultipleInventoryLedgerResponse {
  before: InventoryLedgerEntity[];
  after: InventoryLedgerEntity[];
}
