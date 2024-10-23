import ExchangeCurrencyModel from "@/models/exchange_currency.model";
import { ExchangeCurrencyEntity } from "@/types/exchange_currency.type";
import BaseRepository from "./base.repository";

class ExchangeCurrencyRepository extends BaseRepository<ExchangeCurrencyEntity> {
  protected model: ExchangeCurrencyModel;

  constructor() {
    super();
    this.model = new ExchangeCurrencyModel();
  }

  public async getBaseCurrency() {
    const data = await this.model.select().order("created_at", "DESC").first();

    return data;
  }
}

export const exchangeCurrencyRepository = new ExchangeCurrencyRepository();
export default ExchangeCurrencyRepository;
