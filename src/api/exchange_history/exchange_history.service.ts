import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { exchangeHistoryRepository } from "@/repositories/exchange_history.repository";
import { ExchangeHistoryEntity } from "@/types";
import { DEFAULT_EXCHANGE_CURRENCY } from "./exchange_history.type";
import { isNil } from "lodash";

class ExchangeHistoryService {
  public async createExchangeHistory(
    payload: Pick<
      ExchangeHistoryEntity,
      "from_currency" | "to_currency" | "rate" | "relation_id"
    >
  ) {
    if (isNil(payload?.relation_id)) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const currency = exchangeHistoryRepository.create({
      ...payload,
      from_currency:
        payload.from_currency ?? DEFAULT_EXCHANGE_CURRENCY.from_currency,
      to_currency: payload.to_currency ?? DEFAULT_EXCHANGE_CURRENCY.to_currency,
      rate: payload.rate ?? DEFAULT_EXCHANGE_CURRENCY.rate,
    });

    if (!currency) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    return successResponse({
      data: {
        currency,
      },
    });
  }
}

export const exchangeHistoryService = new ExchangeHistoryService();
export default ExchangeHistoryService;
