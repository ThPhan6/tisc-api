import ExchangeHistoryModel from "@/models/exchange_history.model";
import { ExchangeHistoryEntity } from "@/types";
import BaseRepository from "./base.repository";
import { isEmpty } from "lodash";
import {
  DEFAULT_EXCHANGE_CURRENCY,
  ExchangeCurrencyRequest,
} from "@/api/exchange_history/exchange_history.type";
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

  public async getBaseCurrency(currency: string) {
    const exchangeHistory = await exchangeCurrencyRepository.getBaseCurrency(
      currency
    );

    return exchangeHistory;
  }
}

export const exchangeHistoryRepository = new ExchangeHistoryRepository();
export default ExchangeHistoryRepository;
