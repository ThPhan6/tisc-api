import { ICountryAttributes, DistributorWithLocation } from "@/types";
import { MarketDistributorGroupByCountry } from "./distributor.type";

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

export const mappingResultGetList = (
  distributors: DistributorWithLocation[]
) => {
  return distributors.map((distributor: DistributorWithLocation) => {
    return {
      id: distributor.id,
      name: distributor.name,
      country_name: distributor.country_name,
      city_name: distributor.city_name,
      first_name: distributor.first_name,
      last_name: distributor.last_name,
      email: distributor.email,
      authorized_country_name: distributor.authorized_country_name,
      coverage_beyond: distributor.coverage_beyond,
      created_at: distributor.created_at,
    };
  });
};

export const mappingDistributorByCountry = (
  countries: ICountryAttributes[],
  distributors: DistributorWithLocation[]
) => {
  return countries
    .map((country) => {
      const groupDistributors = distributors.filter(
        (item) => item.country_id === country.id
      );
      const removedFieldsOfDistributor = groupDistributors.map(
        (distributor) => {
          return {
            name: distributor.name,
            address: distributor.address,
            person: distributor.first_name + " " + distributor.last_name,
            gender: distributor.gender,
            email: distributor.email,
            phone: distributor.phone,
            mobile: distributor.mobile,
            authorized_country_name: distributor.authorized_country_name,
            coverage_beyond: distributor.coverage_beyond,
          };
        }
      );
      return {
        country_name: country.name,
        count: groupDistributors.length,
        distributors: removedFieldsOfDistributor,
      };
    })
    .flat();
};

export const mappingMarketDistributorGroupByCountry = (
  distributors: DistributorWithLocation[]
) => {
  const result: MarketDistributorGroupByCountry[] = [];
  distributors.forEach((distributor: any) => {
    const groupIndex = result.findIndex(
      (country) => country.country_name === distributor.country_name
    );
    if (groupIndex === -1) {
      result.push({
        country_name: distributor.country_name,
        count: 1,
        distributors: [distributor],
      });
    } else {
      result[groupIndex] = {
        ...result[groupIndex],
        count: result[groupIndex].count + 1,
        distributors: [...result[groupIndex].distributors, distributor],
      };
    }
  });
  return result;
};
