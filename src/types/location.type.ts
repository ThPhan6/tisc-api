export interface ICountryStateCity {
  country_id: string;
  state_id: any;
  city_id: string;
  country_name: string;
  state_name: string;
  city_name: string;
  phone_code: string;
}

export interface IStateAttributes {
  id: string;
  name: string;
  country_id: string;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string;
  latitude: number;
  longitude: number;
}

export interface ICountryAttributes {
  id: string;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: string;
  latitude: number;
  longitude: number;
  emoji: string;
  emojiU: string;
}
export interface ICityAttributes {
  id: string;
  name: string;
  state_id: string;
  state_code: string;
  state_name: string;
  country_id: string;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  wikiDataId: string;
}
