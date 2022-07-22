import axios from "axios";

export interface ICountry {
  id: number;
  name: string;
  iso2: string;
}
export interface ICountryStateCity {
  country_id: string;
  state_id: any;
  city_id: string;
  country_name: string;
  state_name: string;
  city_name: string;
  phone_code: string;
}
export interface ICountryDetail {
  id: number;
  name: string;
  iso3: string;
  numeric_code: string;
  iso2: string;
  phonecode: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: string;
  translations: string;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}
export interface IStateDetail {
  id: number;
  name: string;
  country_id: string;
  country_code: string;
  iso2: string;
  type: any;
  latitude: string;
  longtitude: string;
}
export interface ICity {
  id: number;
  name: string;
}
const url = "https://api.countrystatecity.in/v1";
const api_key = process.env.X_CSCAPI_KEY || "";
const options = {
  headers: {
    "Content-Type": "application/json",
    "X-CSCAPI-KEY": api_key,
  },
};

export default class CountryStateCityService {
  public getAllCountry = (): Promise<ICountry[]> =>
    new Promise(async (resolve) => {
      try {
        const result = await axios.get(`${url}/countries`, options);
        return resolve(result.data);
      } catch (error) {
        return resolve([]);
      }
    });
  public getCountryDetail = (id: string): Promise<ICountryDetail | any> =>
    new Promise(async (resolve) => {
      try {
        const result = await axios.get(`${url}/countries/${id}`, options);
        return resolve(result.data);
      } catch (error) {
        return resolve({});
      }
    });
  public getAllState = (): Promise<IStateDetail[]> =>
    new Promise(async (resolve) => {
      try {
        const result = await axios.get(`${url}/states`, options);
        return resolve(result.data);
      } catch (error) {
        return resolve([]);
      }
    });
  public getStatesByCountry = (country_id: string): Promise<ICountry[]> =>
    new Promise(async (resolve) => {
      try {
        const result = await axios.get(
          `${url}/countries/${country_id}/states`,
          options
        );
        return resolve(result.data);
      } catch (error) {
        return resolve([]);
      }
    });
  public getStateDetail = (
    country_id: string,
    id: string
  ): Promise<IStateDetail | any> =>
    new Promise(async (resolve) => {
      try {
        const result = await axios.get(
          `${url}/countries/${country_id}/states/${id}`,
          options
        );
        return resolve(result.data);
      } catch (error) {
        return resolve({});
      }
    });
  public getCitiesByStateAndCountry = (
    country_id: string,
    state_id: string
  ): Promise<ICity[]> =>
    new Promise(async (resolve) => {
      try {
        const result = await axios.get(
          `${url}/countries/${country_id}/states/${state_id}/cities`,
          options
        );
        return resolve(result.data);
      } catch (error) {
        return resolve([]);
      }
    });
  public getCitiesByCountry = (country_id: string): Promise<ICity[]> =>
    new Promise(async (resolve) => {
      try {
        const result = await axios.get(
          `${url}/countries/${country_id}/cities`,
          options
        );
        return resolve(result.data);
      } catch (error) {
        return resolve([]);
      }
    });

  public getCountryStateCity = (
    country_id: string,
    city_id: string,
    state_id?: string
  ): Promise<ICountryStateCity | false> =>
    new Promise(async (resolve) => {
      try {
        const country = await this.getCountryDetail(country_id);
        let cities = [];
        let state;
        if (state_id) {
          state = await this.getStateDetail(country_id, state_id);
          cities = await this.getCitiesByStateAndCountry(country_id, state_id);
        }
        cities = await this.getCitiesByCountry(country_id);
        const city = cities.find((item) => item.id.toString() === city_id);
        if (!country || !state || !city) {
          return resolve(false);
        }
        return resolve({
          country_id: country.iso2,
          state_id: state.iso2,
          city_id,
          country_name: country.name,
          state_name: state.name,
          city_name: city.name,
          phone_code: country.phonecode,
        });
      } catch (error) {
        return resolve(false);
      }
    });

  public getCountries = (ids: string[]): Promise<ICountry[] | false> =>
    new Promise(async (resolve) => {
      try {
        let check = true;
        const result = await Promise.all(
          ids.map(async (id) => {
            const country = await this.getCountryDetail(id);
            if (!country.id) {
              check = false;
            }
            return country;
          })
        );
        if (!check) {
          return resolve(false);
        }
        return resolve(result);
      } catch (error) {
        return resolve(false);
      }
    });
}
