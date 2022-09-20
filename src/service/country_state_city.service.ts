import CountryRepository from '@/repositories/country.repository';
import StateRepository from '@/repositories/state.repository';
import CityRepository from '@/repositories/city.repository';
import { GLOBAL_COUNTRY_ID, GlobalCountry } from '@/constants';
import {
  ICountryAttributes,
  IStateAttributes,
  ICityAttributes,
} from '@/types';

export default class CountryStateCityService {
  private countryRepository: CountryRepository;
  private stateRepository: StateRepository;
  private cityRepository: CityRepository;
  constructor() {
    this.countryRepository = new CountryRepository();
    this.stateRepository = new StateRepository();
    this.cityRepository = new CityRepository();
  }
  public getAllCountry = async () => {
      return this.countryRepository.getAll('name', 'ASC');
  }

  public getCountryDetail = async (id: string): Promise<ICountryAttributes | any> => {
    const country = await this.countryRepository.find(id);
    if (!country) {
      return {};
    }
    return country;
  }

  public getCityDetail = async (id: string): Promise<ICityAttributes | any> => {
    const city = await this.cityRepository.find(id);
    if (!city) {
      return {};
    }
    return city;
  }


  public getStatesByCountry = (countryId: string) => {
    return this.stateRepository.getStatesByCountry(countryId);
  }

  public getStateDetail = async (id: string): Promise<IStateAttributes | any> => {
    const state = await this.stateRepository.find(id);
    if (!state) {
      return {};
    }
    return state;
  }

  public getCitiesByStateAndCountry = (countryId: string, stateId?: string) => {
    return this.cityRepository.getCitiesByStateAndCountry(countryId, stateId);
  }


  public getCitiesByCountry = (
    country_id: string
  ) => {
    return this.getCitiesByStateAndCountry(country_id);
  }
  public getCountryStateCity = async (
    countryId: string,
    cityId: string,
    stateId: string
  ) => {
    if (countryId === GLOBAL_COUNTRY_ID) {
      return GlobalCountry;
    }
    const data = await this.cityRepository.findCountryStateCity(countryId, cityId, stateId);
    if (!data) {
      return false;
    }
    return data;
  }

  public getCountries = async ( ids: string[] ): Promise<ICountryAttributes[] | false> => {
    let check = true;
    const result = await Promise.all(ids.map(async (id) => {
      const country = await this.getCountryDetail(id);
      if (!country.id) {
        check = false;
      }
      return country as ICountryAttributes;
    }));
    if (check) {
      return result;
    }
    return false;
  }
}
