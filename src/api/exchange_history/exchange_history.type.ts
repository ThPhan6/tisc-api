import { getTimestamps } from "@/Database/Utils/Time";
import { ExchangeCurrencyCode, ExchangeHistoryEntity } from "@/types";

export const DEFAULT_EXCHANGE_CURRENCY: ExchangeHistoryEntity = {
  id: "",
  relation_id: "",
  from_currency: ExchangeCurrencyCode.USD,
  to_currency: ExchangeCurrencyCode.USD,
  rate: 1,
  created_at: getTimestamps(),
  deleted_at: null,
};
