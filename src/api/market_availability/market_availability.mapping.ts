import { Region } from "@/constants";
import { ListMarketAvailability, RegionMarket, RegionKey } from "@/types";
import { getEnumKeys, sortObjectArray } from "@/helpers/common.helper";
import { startCase } from "lodash";

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
    africa: countryData.filter((country) => country.region === Region.africa),
    asia: countryData.filter((country) => country.region === Region.asia),
    europe: countryData.filter((country) => country.region === Region.europe),
    n_americas: countryData.filter(
      (country) => country.region === Region.n_americas
    ),
    oceania: countryData.filter((country) => country.region === Region.oceania),
    s_americas: countryData.filter(
      (country) => country.region === Region.s_americas
    ),
  };
};
export const mappingMarketAvailibility = (
  marketAvailability: ListMarketAvailability,
  availableOnly: boolean = true
) => {
  ///
  return {
    id: marketAvailability.id,
    name: marketAvailability.name,
    collection_id: marketAvailability.collection_id,
    countries: marketAvailability.countries,
    available_countries: marketAvailability.countries.filter(
      (country) => country.available
    ).length,
    ...mappingRegion(marketAvailability.countries, availableOnly),
  };
};

export const mappingGroupByCollection = (
  marketAvailabilities: ListMarketAvailability[]
) => {
  return sortObjectArray(
    marketAvailabilities.map((marketAvailability) => {
      const data = mappingMarketAvailibility(marketAvailability);
      return {
        collection_name: data.name,
        count: data.available_countries,
        regions: getEnumKeys(Region).map((region: any) => {
          const regionName = region as RegionKey;
          return {
            count: data[regionName].length,
            region_name: Region[regionName],
            region_country: sortObjectArray(data[regionName], "name", "ASC")
              .map((country) => startCase(country.name))
              .join(", "),
          };
        }),
      };
    }),
    "collection_name",
    "ASC"
  );
};
