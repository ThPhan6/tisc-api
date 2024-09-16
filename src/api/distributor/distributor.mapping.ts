import { sortObjectArray } from "@/helpers/common.helper";
import { ICountryAttributes, DistributorWithLocation } from "@/types";
import { MarketDistributorGroupByCountry } from "./distributor.type";
import { PartnerContactAttributes } from "@/api/partner_contact/partner_contact.type";

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
  distributors: DistributorWithLocation[],
  partnerContacts: PartnerContactAttributes[]
) => {
  return sortObjectArray(
    countries
      .map((country) => {
        const groupDistributors = distributors.filter(
          (item) => item.country_id === country.id
        );

        const removedFieldsOfDistributor = groupDistributors.map(
          (distributor) => {
            const partnerContact = partnerContacts.find(
              (item) => item.partner_company_id === distributor.id
            );

            const person = partnerContact
              ? `${partnerContact.firstname || ""} ${
                  partnerContact.lastname || ""
                }`.trim()
              : "";

            return {
              name: distributor.name,
              address: distributor.address,
              person,
              gender: partnerContact ? partnerContact?.gender : false,
              email: distributor.email,
              phone: distributor.phone,
              mobile: partnerContacts ? partnerContact?.mobile : "",
              authorized_country_name: distributor.authorized_country_name,
              coverage_beyond: distributor.coverage_beyond,
            };
          }
        );
        return {
          country_name: country.name,
          count: groupDistributors.length,
          distributors: sortObjectArray(
            removedFieldsOfDistributor,
            "name",
            "ASC"
          ),
        };
      })
      .flat(),
    "country_name",
    "ASC"
  );
};

export const mappingMarketDistributorGroupByCountry = (
  distributors: DistributorWithLocation[]
) => {
  const result: MarketDistributorGroupByCountry[] = [];
  distributors.forEach((distributor: any) => {
    const {
      acquisition_id,
      acquisition_name,
      affiliation_id,
      affiliation_name,
      contact,
      price_rate,
      relation_id,
      relation_name,
      remark,
      website,
      ...filteredDistributor
    } = distributor;

    if (acquisition_name !== "Active") return;

    const groupIndex = result.findIndex(
      (country) => country.country_name === filteredDistributor.country_name
    );

    if (groupIndex === -1) {
      result.push({
        country_name: filteredDistributor.country_name,
        count: 1,
        distributors: [filteredDistributor],
      });
      return;
    }

    result[groupIndex] = {
      ...result[groupIndex],
      count: result[groupIndex].count + 1,
      distributors: [...result[groupIndex].distributors, filteredDistributor],
    };
  });
  return result;
};
