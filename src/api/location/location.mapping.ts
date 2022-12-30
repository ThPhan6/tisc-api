import {
  ILocationAttributes,
  CountryGroupCount,
  DesignLocationFunctionTypeOption,
  LocationWithTeamCountAndFunctionType,
} from "@/types";
import { head } from "lodash";
import { sortObjectArray } from "@/helper/common.helper";

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
  const firstFunctionType = head(functional_type_ids);
  if (!firstFunctionType) {
    return undefined;
  }
  const functionalTypeOption = DesignLocationFunctionTypeOption.find(
    (option) => option.id === firstFunctionType
  );
  if (functionalTypeOption) {
    return [
      {
        id: String(functionalTypeOption.id),
        name: String(functionalTypeOption.name),
      },
    ];
  }
  return undefined;
};

export const sortMainOfficeFirst = (
  data: LocationWithTeamCountAndFunctionType[]
) => {
  const mainOffices = sortObjectArray(
    data.filter((item) => item.functional_type === "Main office"),
    "functional_type",
    "ASC"
  );

  const rest = sortObjectArray(
    data.filter((item) => item.functional_type !== "Main office"),
    "business_number",
    "ASC"
  );
  return mainOffices.concat(rest);
};
