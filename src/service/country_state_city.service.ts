import CountryModel, { ICountryAttributes } from "../model/country";
import StateModel, { IStateAttributes } from "../model/state";
import CityModel, { ICityAttributes } from "../model/city";
export interface ICountryStateCity {
  country_id: string;
  state_id: any;
  city_id: string;
  country_name: string;
  state_name: string;
  city_name: string;
  phone_code: string;
}
export default class CountryStateCityService {
  private countryModel: CountryModel;
  private stateModel: StateModel;
  private cityModel: CityModel;
  constructor() {
    this.countryModel = new CountryModel();
    this.stateModel = new StateModel();
    this.cityModel = new CityModel();
  }
  public getAllCountry = (): Promise<ICountryAttributes[]> =>
    new Promise(async (resolve) => {
      try {
        const result = await this.countryModel.getAll(undefined, "name", "ASC");
        return resolve(result);
      } catch (error) {
        return resolve([]);
      }
    });
  public getCountryDetail = (id: string): Promise<ICountryAttributes | any> =>
    new Promise(async (resolve) => {
      try {
        const result = await this.countryModel.find(id);
        if (result === undefined) {
          return resolve({});
        }
        return resolve(result);
      } catch (error) {
        return resolve({});
      }
    });
  public getCityDetail = (id: string): Promise<ICityAttributes | any> =>
    new Promise(async (resolve) => {
      try {
        const result = await this.cityModel.find(id);
        if (result === undefined) {
          return resolve({});
        }
        return resolve(result);
      } catch (error) {
        return resolve({});
      }
    });
  public getStatesByCountry = (
    country_id: string
  ): Promise<IStateAttributes[]> =>
    new Promise(async (resolve) => {
      try {
        const states = await this.stateModel.getAllBy(
          {
            country_id,
          },
          undefined,
          "name",
          "ASC"
        );
        return resolve(states);
      } catch (error) {
        return resolve([]);
      }
    });
  public getStateDetail = (id: string): Promise<IStateAttributes | any> =>
    new Promise(async (resolve) => {
      try {
        const result = await this.stateModel.find(id);
        return resolve(result);
      } catch (error) {
        return resolve({});
      }
    });
  public getCitiesByStateAndCountry = (
    country_id: string,
    state_id: string
  ): Promise<ICityAttributes[]> =>
    new Promise(async (resolve) => {
      try {
        const result = await this.cityModel.getAllBy(
          {
            country_id,
            state_id,
          },
          undefined,
          "name",
          "ASC"
        );
        return resolve(result);
      } catch (error) {
        return resolve([]);
      }
    });
  public getCitiesByCountry = (
    country_id: string
  ): Promise<ICityAttributes[]> =>
    new Promise(async (resolve) => {
      try {
        const result = await this.cityModel.getBy({
          country_id,
        });
        return resolve(result);
      } catch (error) {
        return resolve([]);
      }
    });

  public getCountryStateCity = (
    country_id: string,
    city_id?: string,
    state_id?: string
  ): Promise<ICountryStateCity | false | any> =>
    new Promise(async (resolve) => {
      try {
        if (country_id === "-1") {
          return resolve({
            country_id: "-1",
            country_name: "Global",
            state_id: "",
            state_name: "",
            city_id: "",
            city_name: "",
          });
        }
        const country = await this.countryModel.find(country_id);
        const city = await this.cityModel.find(city_id || "");
        const state = await this.stateModel.find(state_id || "");
        return resolve({
          country_id: country?.id || "",
          state_id: state?.id || "",
          city_id: city?.id || "",
          country_name: country?.name || "",
          state_name: state?.name || "",
          city_name: city?.name || "",
          phone_code: country?.phone_code || "",
        });
      } catch (error) {
        return resolve(false);
      }
    });

  public getCountries = (
    ids: string[]
  ): Promise<ICountryAttributes[] | false> =>
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
