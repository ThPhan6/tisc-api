import { Region } from "@/constants";
import {
  ListMarketAvailability,
  RegionMarket,
} from "@/types";
import {getEnumValues} from '@/helper/common.helper';
import {lowerCase, startCase} from 'lodash';

export const mappingRegion = (
  countries: RegionMarket[],
  availableOnly: boolean = true
) => {
  const countryData = countries.filter((country) => {
    if (availableOnly) {
      return country.available;
    }
    return true;
  });
  return {
    asia: countryData.filter((country) => country.region === Region.Asia),
    europe: countryData.filter((country) => country.region === Region.Europe),
    africa: countryData.filter((country) => country.region === Region.Africa),
    polar: countryData.filter((country) => country.region === Region.Polar),
    americas: countryData.filter((country) => country.region === Region.Americas),
    oceania: countryData.filter((country) => country.region === Region.Oceania),
  }
}

export const mappingMarketAvailibility = (
  marketAvailability: ListMarketAvailability,
  availableOnly: boolean = true
) => {
  const countries = marketAvailability.authorized_countries.map((authorized_country) => {
    //
    const country = marketAvailability.countries.find((country) => country.id === authorized_country.id);
    //
    const regionMarket = {
      id: authorized_country.id,
      name: authorized_country.name,
      region: authorized_country.region,
      phone_code: authorized_country.phone_code,
      available: true,
    }
    //
    if (country) {
      regionMarket.available = country.available;
      return regionMarket;
    }
    //
    return regionMarket;
  });
  ///
  return {
    id: marketAvailability.id,
    name: marketAvailability.name,
    collection_id: marketAvailability.collection_id,
    countries,
    available_countries: countries.filter((country) => country.available).length,
    ...mappingRegion(countries, availableOnly)
  }
};

export const mappingGroupByCollection = (
  marketAvailabilities: ListMarketAvailability[]
) => {
  return marketAvailabilities.map((marketAvailability) => {
    const data = mappingMarketAvailibility(marketAvailability);
    return {
      collection_name: data.name,
      count: data.available_countries,
      regions: getEnumValues(Region).map((region: any) => {
        const regionName = lowerCase(region) as 'asia' | 'europe' | 'africa' | 'polar' | 'americas' | 'oceania';

        return {
          count: data[regionName].length,
          region_name: startCase(regionName),
          region_country: data[regionName].map((country) => startCase(country.name)).join(', ')
        }
      })
    }
  })
};
