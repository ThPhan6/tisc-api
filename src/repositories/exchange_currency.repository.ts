import ExchangeCurrencyModel from "@/models/exchange_currency.model";
import {
  ExchangeCurrencyEntity,
  IExchangeCurrency,
} from "@/types/exchange_currency.type";
import BaseRepository from "./base.repository";

class ExchangeCurrencyRepository extends BaseRepository<ExchangeCurrencyEntity> {
  protected model: ExchangeCurrencyModel;

  constructor() {
    super();
    this.model = new ExchangeCurrencyModel();
  }

  public async getBaseCurrency(
    currency?: string
  ): Promise<IExchangeCurrency[] | IExchangeCurrency | null> {
    const data = (await this.model
      .select()
      .order("created_at", "DESC")
      .first()) as ExchangeCurrencyEntity;

    if (currency) {
      return data.data.find(
        (el) => el.code.toUpperCase() === currency.toUpperCase()
      ) as IExchangeCurrency | null;
    }

    return data.data as IExchangeCurrency[];
  }
}

export const exchangeCurrencyRepository = new ExchangeCurrencyRepository();
export default ExchangeCurrencyRepository;
