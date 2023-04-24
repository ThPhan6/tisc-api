import { ICountryStateCity } from "@/types";

export const GLOBAL_COUNTRY_ID = "-1";

export const GlobalCountry: ICountryStateCity = {
  country_id: GLOBAL_COUNTRY_ID,
  country_name: "Global",
  state_id: "",
  state_name: "",
  city_id: "",
  city_name: "",
  phone_code: "",
};

export enum Region {
  africa = "Africa",
  asia = "Asia",
  europe = "Europe",
  n_americas = "N. America",
  oceania = "Oceania",
  s_americas = "S. America",
}

export const SupportedCurrency = [
  "USD",
  "AUD",
  "CAD",
  "SGD",
  "NZD",
  "HKD",
  "JPY",
  "EUR",
  "GBP",
  "CHF",
];
export const DefaultCurrency = "SGD"