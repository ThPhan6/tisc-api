import Model from "./index";
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
export default class CountryModel extends Model<ICountryAttributes> {
  constructor() {
    super("countries");
  }
}
