import { DEFAULT_EXCHANGE_CURRENCY } from "@/api/exchange_history/exchange_history.type";
import ExchangeHistoryModel from "@/models/exchange_history.model";
import {
  EBaseCurrency,
  ExchangeHistoryEntity,
  IExchangeCurrency,
} from "@/types";
import { isEmpty, isNumber } from "lodash";
import BaseRepository from "./base.repository";
import { exchangeCurrencyRepository } from "./exchange_currency.repository";

class ExchangeHistoryRepository extends BaseRepository<ExchangeHistoryEntity> {
  protected model: ExchangeHistoryModel;

  constructor() {
    super();
    this.model = new ExchangeHistoryModel();
  }

  public async getLatestHistory(
    brandId: string,
    props: { createNew?: boolean } = { createNew: true }
  ): Promise<ExchangeHistoryEntity | null> {
    let data = await this.model
      .where("relation_id", "==", brandId)
      .where("deleted_at", "==", null)
      .order("created_at", "DESC")
      .first();

    if (isEmpty(data) && props.createNew) {
      ///create new exchange history
      data = await this.create({
        ...DEFAULT_EXCHANGE_CURRENCY,
        relation_id: brandId,
      });
    }

    return data as ExchangeHistoryEntity;
  }

  public async createExchangeHistory(
    payload: Pick<
      ExchangeHistoryEntity,
      "from_currency" | "to_currency" | "relation_id"
    >
  ): Promise<ExchangeHistoryEntity | null> {
    /// find currency which is going to be exchanged
    const currencyExchange = (await exchangeCurrencyRepository.getBaseCurrency(
      payload.to_currency
    )) as IExchangeCurrency;

    if (isEmpty(currencyExchange)) {
      return null;
    }

    const latestExchanged = (await this.model
      .where("deleted_at", "==", null)
      .where("relation_id", "==", payload.relation_id)
      .order("created_at", "DESC")
      .first()) as ExchangeHistoryEntity;

    if (
      isEmpty(latestExchanged) ||
      isEmpty(payload) ||
      !isNumber(currencyExchange.rate) ||
      isEmpty(payload.from_currency) ||
      isEmpty(payload.to_currency) ||
      isEmpty(payload.relation_id) ||
      latestExchanged.to_currency !== payload.from_currency
    ) {
      return null;
    }

    const previousCurrency = (await exchangeCurrencyRepository.getBaseCurrency(
      payload.from_currency
    )) as IExchangeCurrency;

    if (isEmpty(previousCurrency)) {
      return null;
    }

    const rate = currencyExchange.rate / previousCurrency.rate;

    const result = await this.create({
      ...payload,
      rate,
    });

    if (isEmpty(result)) {
      return null;
    }

    return result as ExchangeHistoryEntity;
  }
}

export const exchangeHistoryRepository = new ExchangeHistoryRepository();
export default ExchangeHistoryRepository;
