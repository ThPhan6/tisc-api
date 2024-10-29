import Model from "@/Database/Model";
import { ExchangeCurrencyEntity } from "@/types/exchange_currency.type";

export default class ExchangeCurrencyModel extends Model<ExchangeCurrencyEntity> {
  protected table = "exchange_currencies";
  protected softDelete = true;
}
