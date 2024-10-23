import { getTimestamps } from "@/Database/Utils/Time";
import { EBaseCurrency, ExchangeHistoryEntity } from "@/types";

export const DEFAULT_EXCHANGE_CURRENCY: ExchangeHistoryEntity = {
  id: "",
  relation_id: "",
  from_currency: EBaseCurrency.USD,
  to_currency: EBaseCurrency.USD,
  rate: 1,
  created_at: getTimestamps(),
  deleted_at: null,
};

export interface ExchangeCurrencyRequest
  extends Pick<ExchangeHistoryEntity, "to_currency" | "relation_id"> {}
