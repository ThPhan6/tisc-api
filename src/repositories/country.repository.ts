import CountryModel from '@/model/country.model';
import BaseRepository from './base.repository';
import {ICountryAttributes} from '@/types';

class CountryRepository extends BaseRepository<ICountryAttributes> {
  protected model: CountryModel;

  constructor() {
    super();
    this.model = new CountryModel();
  }
}

export default new CountryRepository();
