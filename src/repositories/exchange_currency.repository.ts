import ExchangeCurrencyModel from "@/models/exchange_currency.model";
import {
  ExchangeCurrencyEntity,
  IExchangeCurrency,
} from "@/types/exchange_currency.type";
import BaseRepository from "./base.repository";
import { freeCurrencyService } from "@/services/free_currency.service";
import { forEach } from "lodash";

class ExchangeCurrencyRepository extends BaseRepository<ExchangeCurrencyEntity> {
  protected model: ExchangeCurrencyModel;

  constructor() {
    super();
    this.model = new ExchangeCurrencyModel();
  }

  /// TODO: using this getBaseCurrency later
  // public async getBaseCurrency(
  //   currency?: string
  // ): Promise<ExchangeCurrencyEntity[] | ExchangeCurrencyEntity | null> {
  //   if (currency) {
  //     const data = await this.model
  //       .select()
  //       .order("created_at", "DESC")
  //       .where(`${currency.toUpperCase()}`, "==", currency)
  //       .first();

  //     return data;
  //   }

  //   const data = await this.model.select().order("created_at", "DESC").first();

  //   return data;
  // }

  /// TODO!: delete this getBaseCurrency later
  public async getBaseCurrency(
    currency?: string
  ): Promise<IExchangeCurrency[] | IExchangeCurrency | null> {
    if (currency) {
      const data = await freeCurrencyService.exchangeCurrencies();

      return data.find(
        (el) => el.code.toUpperCase() === currency.toUpperCase()
      );
    }

    return await freeCurrencyService.exchangeCurrencies();
  }
}

export const exchangeCurrencyRepository = new ExchangeCurrencyRepository();
export default ExchangeCurrencyRepository;
