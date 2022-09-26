import { ICountryAttributes, IDistributorAttributes } from "@/types";

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
  distributors: IDistributorAttributes[]
) => {
  return distributors.map((distributor: IDistributorAttributes) => {
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
  distributors: IDistributorAttributes[]
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
