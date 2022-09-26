import CityModel from '@/model/city.model';
import BaseRepository from './base.repository';
import {ICityAttributes, ICountryStateCity} from '@/types';

class CityRepository extends BaseRepository<ICityAttributes> {
  protected model: CityModel;

  constructor() {
    super();
    this.model = new CityModel();
  }

  public getCitiesByStateAndCountry = async (countryId: string, stateId?: string) => {
    let query = this.model
      .where('country_id', '==', countryId);
    if (stateId) {
      query = query.where('state_id', '==', stateId);
    }
    return await query.order('name', 'ASC').get() as ICityAttributes[];
  }

  public findCountryStateCity = async (
    countryId: string,
    cityId: string,
    stateId: string
  ) => {
    return await this.model
      .select(
        'cities.id as city_id',
        'cities.name as city_name',
        'cities.state_id as state_id',
        'cities.country_id as country_id',
        'countries.name as country_name',
        'countries.phone_code as phone_code',
        'states.name as state_name',
      )
      .join('countries', 'countries.id', '==', 'cities.country_id')
      .join('states', 'states.id', '==', 'cities.state_id')
      .where('cities.id', '==', cityId)
      .where('cities.state_id', '==', stateId)
      .where('cities.country_id', '==', countryId)
      .first() as ICountryStateCity | undefined;
  }

}

export default new CityRepository();
