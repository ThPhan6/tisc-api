import { ICountryAttributes } from "@/types";

export const mappingAuthorizedCountriesName = (
  authorizedCountries: ICountryAttributes[]
) => {
  return authorizedCountries.reduce((pre, cur, index) => {
    if (index === 0) {
      return pre + cur.name;
    }
    return pre + ", " + cur.name;
  }, "");
};

export const mappingAuthorizedCountries = (
  authorizedCountries: ICountryAttributes[]
) => {
  return authorizedCountries.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });
};
