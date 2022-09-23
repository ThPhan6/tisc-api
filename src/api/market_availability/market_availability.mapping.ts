import { REGION_KEY } from "@/constants";
import {
  ICollectionAttributes,
  ICountryAttributes,
  IRegionCountry,
  IMarketAvailabilityAttributes,
} from "@/types";
import { IMarketAvailabilityResponse } from "./market_availability.type";

export const mappingRegionCountries = (countryDetail: ICountryAttributes) => {
  let region = REGION_KEY.AFRICA;
  if (countryDetail.region?.toLowerCase() === REGION_KEY.AMERICAS) {
    if (countryDetail.subregion?.toLowerCase() === REGION_KEY.NORTHERN_AMERICA)
      region = REGION_KEY.NORTH_AMERICA;
    else region = REGION_KEY.SOUTH_AMERICA;
  }
  if (countryDetail.region?.toLowerCase() === REGION_KEY.ASIA)
    region = REGION_KEY.ASIA;
  if (countryDetail.region?.toLowerCase() === REGION_KEY.AFRICA)
    region = REGION_KEY.AFRICA;
  if (countryDetail.region?.toLowerCase() === REGION_KEY.OCEANIA)
    region = REGION_KEY.OCEANIA;
  if (countryDetail.region?.toLowerCase() === REGION_KEY.EUROPE)
    region = REGION_KEY.EUROPE;
  return {
    id: countryDetail.id,
    name: countryDetail.name,
    phone_code: countryDetail.phone_code,
    region,
  };
};

export const mappingResponseGetMarket = (
  collectionId: string,
  collectionName: string,
  distributorCountries: IRegionCountry[],
  market: IMarketAvailabilityAttributes
) => {
  const regionNames = Object.values(REGION_KEY);
  const regions = regionNames.map((item) => {
    const countries = distributorCountries
      .filter((country) => country.region === item)
      .map((country) => {
        return {
          ...country,
          id: country.id,
          available: market.country_ids.includes(country.id),
        };
      });
    return {
      name: item,
      count: countries.length,
      countries,
    };
  });
  return {
    collection_id: collectionId,
    collection_name: collectionName,
    total_available: market.country_ids.length,
    total: distributorCountries.length,
    regions,
  };
};

export const mappingResponseListMarket = (
  collection: ICollectionAttributes,
  countries: IRegionCountry[]
) => {
  return {
    collection_id: collection.id,
    collection_name: collection.name,
    available_countries: countries.length || 0,
    africa: countries.filter((item) => item.region === REGION_KEY.AFRICA)
      .length,
    asia: countries.filter((item) => item.region === REGION_KEY.ASIA).length,
    europe: countries.filter((item) => item.region === REGION_KEY.EUROPE)
      .length,
    north_america: countries.filter(
      (item) => item.region === REGION_KEY.NORTH_AMERICA
    ).length,
    oceania: countries.filter((item) => item.region === REGION_KEY.OCEANIA)
      .length,
    south_america: countries.filter(
      (item) => item.region === REGION_KEY.SOUTH_AMERICA
    ).length,
  };
};

export const mappingGroupByCollection = (
  marketAvailabilities: IMarketAvailabilityResponse[]
) => {
  return marketAvailabilities.map(
    (marketAvailability: IMarketAvailabilityResponse) => {
      let countRegion = 0;
      const regions = marketAvailability.data.regions.map((region) => {
        const availableCountries = region.countries.filter(
          (country) => country.available === true
        );
        countRegion += availableCountries.length;
        const regionCountry = availableCountries
          .map((country) => {
            return country.name;
          })
          .join(", ");
        return {
          region_name: region.name,
          count: availableCountries.length,
          region_country: regionCountry,
        };
      });
      return {
        collection_name: marketAvailability.data.collection_name,
        count: countRegion,
        regions,
      };
    }
  );
};
