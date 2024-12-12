import { InventoryLedgerEntity } from "@/types";

export interface MultipleInventoryLedgerRequest
  extends Pick<
    InventoryLedgerEntity,
    "inventory_id" | "warehouse_id" | "quantity"
  > {
  convert?: number;
}
