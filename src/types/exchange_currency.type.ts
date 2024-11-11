export interface ExchangeCurrencyEntity {
  id: string;
  data: IExchangeCurrency[];
  created_at: string;
  deleted_at: null | string;
}

export interface IExchangeCurrency {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string; /// USD, EUR, etc
  name_plural: string;
  type: string;
  rate: number;
}

export enum EBaseCurrency {
  USD = "USD",
  AUD = "AUD",
  EUR = "EUR",
}
