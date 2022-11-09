import countryRepository from "@/repositories/country.repository";
import stateRepository from "@/repositories/state.repository";
import cityRepository from "@/repositories/city.repository";
import { GLOBAL_COUNTRY_ID, GlobalCountry, MESSAGES } from "@/constants";
import {
  ICountryAttributes,
  IStateAttributes,
  ICityAttributes,
  ICountryStateCity,
} from "@/types";
import { errorMessageResponse } from "@/helper/response.helper";
import { isEmpty } from "lodash";

class CountryStateCityService {
  public getAllCountry = async () => {
    return countryRepository.getAll("name", "ASC");
  };

  public getCountryDetail = async (
    id: string
  ): Promise<ICountryAttributes | any> => {
    const country = await countryRepository.find(id);
    if (!country) {
      return {};
    }
    return country;
  };

  public getCityDetail = async (id: string): Promise<ICityAttributes | any> => {
    const city = await cityRepository.find(id);
    if (!city) {
      return {};
    }
    return city;
  };

  public getStatesByCountry = (countryId: string) => {
    return stateRepository.getStatesByCountry(countryId);
  };

  public getStateDetail = async (
    id: string
  ): Promise<IStateAttributes | any> => {
    const state = await stateRepository.find(id);
    if (!state) {
      return {};
    }
    return state;
  };

  public getCitiesByStateAndCountry = (countryId: string, stateId?: string) => {
    return cityRepository.getCitiesByStateAndCountry(countryId, stateId);
  };

  public getCitiesByCountry = (country_id: string) => {
    return this.getCitiesByStateAndCountry(country_id);
  };
  public getCountryStateCity = async (
    countryId: string,
    cityId?: string,
    stateId?: string
  ): Promise<ICountryStateCity> => {
    if (countryId === GLOBAL_COUNTRY_ID) {
      return GlobalCountry;
    }
    const country = await this.getCountryDetail(countryId);
    if (!country.id) {
      return GlobalCountry;
    }
    const countryData = {
      country_name: country.name,
      phone_code: country.phone_code,
      country_id: country.id,
    };

    if (!stateId || stateId == "") {
      return {
        ...GlobalCountry,
        ...countryData,
      };
    }
    const state = await this.getStateDetail(stateId);
    if (!state.id || state.country_id !== countryId) {
      return {
        ...GlobalCountry,
        ...countryData,
      };
    }
    const stateData = {
      state_id: state.id,
      state_name: state.name,
    };
    if (!cityId || cityId == "") {
      return {
        ...GlobalCountry,
        ...countryData,
        ...stateData,
      };
    }
    const city = await this.getCityDetail(cityId);
    if (
      !city.id ||
      city.country_id !== countryId ||
      city.state_id !== stateId
    ) {
      return {
        ...GlobalCountry,
        ...countryData,
        ...stateData,
      };
    }
    return {
      ...GlobalCountry,
      ...countryData,
      ...stateData,
      city_id: city.id,
      city_name: city.name,
    };
  };

  public getCountries = async (
    ids: string[]
  ): Promise<ICountryAttributes[] | false> => {
    let check = true;
    const result = await Promise.all(
      ids.map(async (id) => {
        const country = await this.getCountryDetail(id);
        if (!country.id) {
          check = false;
        }
        return country as ICountryAttributes;
      })
    );
    if (check) {
      return result;
    }
    return false;
  };

  public validateLocationData = async (
    countryId: string,
    cityId: string,
    stateId: string
  ) => {
    const country = await this.getCountryDetail(countryId);
    if (!country.id) {
      return errorMessageResponse(MESSAGES.COUNTRY_NOT_FOUND, 404);
    }
    ////////////////////////
    const states = await this.getStatesByCountry(countryId);

    if (!isEmpty(states)) {
      if (!stateId || stateId === "") {
        return errorMessageResponse(MESSAGES.STATE_REQUIRED, 400);
      }
      /// state not in country
      if (!states.find((item) => item.id === stateId)) {
        return errorMessageResponse(MESSAGES.STATE_NOT_IN_COUNTRY, 400);
      }

      /// get city from state and country
      const cities = await this.getCitiesByStateAndCountry(countryId, stateId);
      if (!isEmpty(cities)) {
        if (!cityId || cityId === "") {
          return errorMessageResponse(MESSAGES.CITY_REQUIRED, 400);
        }
        /// city not in state
        if (!cities.find((item) => item.id === cityId)) {
          return errorMessageResponse(MESSAGES.CITY_NOT_IN_STATE, 400);
        }
      }
    }
    return true;
  };
}

export const countryStateCityService = new CountryStateCityService();

export default CountryStateCityService;
