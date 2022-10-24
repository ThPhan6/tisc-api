import {getRegionName} from '@/constants/location.constant';
import {RegionGroup, ICountryAttributes, RegionGroupKey} from '@/types';

export const mappingCountryByRegion = (countries: ICountryAttributes[]) => {
  const regionGroup: RegionGroup = {
    africa: [], asia: [], europe: [],
    n_america: [], oceania: [], s_america: []
  };
  const response = countries.reduce((res: RegionGroup, country) => {
    const region = country.region.toLowerCase();
    const subregion = country.subregion.toLowerCase();
    const countryData = {
      id: country.id,
      name: country.name,
      phone_code: country.phone_code,
    }

    if (region === "americas") {
      if (subregion === "northern america") {
        res.n_america = res.n_america.concat(countryData);
      } else {
        res.s_america = res.s_america.concat(countryData);
      }
    } else if (region === "asia") {
        res.asia = res.asia.concat(countryData);
    } else if (region === "africa") {
        res.africa = res.africa.concat(countryData);
    } else if (region === "oceania") {
        res.oceania = res.oceania.concat(countryData);
    } else {
      res.europe = res.europe.concat(countryData);
    }
    return res;
  }, regionGroup);

  const keys = Object.keys(response) as RegionGroupKey[];
  return keys.map((key) => ({
    name: getRegionName(key),
    count: response[key].length,
    countries: response[key],
  }));
}
