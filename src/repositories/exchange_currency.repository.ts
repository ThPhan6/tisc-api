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

  public async getBaseCurrencies(
    currencies?: string[]
  ): Promise<IExchangeCurrency[]> {
    const data = (await this.model
      .select()
      .order("created_at", "DESC")
      .first()) as { data: IExchangeCurrency[] };

    if (currencies?.length) {
      return data.data.filter((el) =>
        currencies.find((cur) => el.code.toUpperCase() === cur.toUpperCase())
      );
    }

    return data.data ?? [];
  }
}

export const exchangeCurrencyRepository = new ExchangeCurrencyRepository();
export default ExchangeCurrencyRepository;
