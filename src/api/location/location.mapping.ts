import { FUNCTIONAL_TYPE_OPTIONS } from "@/constants";
import { ILocationAttributes, CountryGroupCount } from "@/types";

export const getUniqueCountries = (locations: ILocationAttributes[]) => {
  return locations.reduce((res: CountryGroupCount[], location) => {
    const index = res.findIndex(
      (locat) => locat.country_name === location.country_name
    );
    if (index == -1) {
      // not found
      res = res.concat({
        country_name: location.country_name,
        count: 1,
      });
    } else {
      res[index].count = res[index].count + 1;
    }
    return res;
  }, []);
};

export const mappingByCountries = (
  locations: ILocationAttributes[],
  filterEmpty = false
) => {
  const uniqueCountries = getUniqueCountries(locations);
  let response = uniqueCountries.map((country) => {
    const groupLocations = locations.filter(
      (item) => item.country_name === country.country_name
    );
    return {
      ...country,
      locations: groupLocations,
    };
  });
  if (filterEmpty) {
    response = response.filter((item) => item.locations && item.locations[0]);
  }
  return response;
};

export const getDesignFunctionType = (functional_type_ids: string[]) => {
  return FUNCTIONAL_TYPE_OPTIONS.find(
    (option) => option.value === Number(functional_type_ids[0])
  );
};
