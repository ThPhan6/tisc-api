import CountryModel from '@/model/country.model';
import BaseRepository from './base.repository';
import {ICountryAttributes} from '@/types';

class CountryRepository extends BaseRepository<ICountryAttributes> {
  protected model: CountryModel;

  constructor() {
    super();
    this.model = new CountryModel();
  }

  public groupByRegion() {
    return this.model.rawQueryV2(`LET regions = (
        FOR c IN countries
        FILTER c.region != ""
        FILTER c.deleted_at == null
        SORT c.region ASC
        RETURN DISTINCT c.region
    )
    FOR region in regions
        let countries = (
            FOR country in countries
            FILTER country.region == region
            FILTER country.deleted_at == null
            SORT country.name ASC
            RETURN {
                id: country.id,
                name: country.name,
                phone_code: country.phone_code
            }
        )

    return {
        name: UPPER(region),
        count: COUNT(countries),
        countries: countries
    }`, {});
  }

  public findByIsoCode = async (code: string) => {
    return await this.model.where('iso3', '==', code.toUpperCase())
      .orWhere('iso2', '==', code.toUpperCase())
      .first() as ICountryAttributes | undefined;
  }
}

export default new CountryRepository();
export const countryRepository = new CountryRepository();
