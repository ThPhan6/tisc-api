import { mappingAuthorizedCountriesName } from "@/api/distributor/distributor.mapping";
import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { locationRepository } from "@/repositories/location.repository";
import partnerRepository from "@/repositories/partner.repository";
import { countryStateCityService } from "@/services/country_state_city.service";
import { SortOrder, UserAttributes } from "@/types";
import { PartnerAttributes } from "@/types/partner.type";

class PartnerService {
  public create = async (
    authenticatedUser: UserAttributes,
    payload: PartnerAttributes
  ) => {
    const isValidGeoLocation =
      await countryStateCityService.validateLocationData(
        payload.country_id,
        payload.city_id,
        payload.state_id
      );

    if (isValidGeoLocation !== true) return isValidGeoLocation;

    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    if (!countryStateCity)
      return errorMessageResponse(MESSAGES.COUNTRY_STATE_CITY_NOT_FOUND);

    const locationInfo = {
      country_id: countryStateCity.country_id,
      state_id: countryStateCity.state_id,
      city_id: countryStateCity.city_id,
      country_name: countryStateCity.country_name,
      state_name: countryStateCity.state_name,
      city_name: countryStateCity.city_name,
      phone_code: countryStateCity.phone_code,
      address: payload.address,
      postal_code: payload.postal_code,
    };

    const location = await locationRepository.create(locationInfo);
    if (!location) return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);

    const authorizedCountries = await countryStateCityService.getCountries(
      payload.authorized_country_ids
    );

    if (!authorizedCountries)
      return errorMessageResponse("Not authorized countries, please check ids");

    const authorizedCountriesName =
      mappingAuthorizedCountriesName(authorizedCountries);

    const affiliation = await commonTypeRepository.findOrCreate(
      payload.affiliation_id,
      authenticatedUser.relation_id,
      COMMON_TYPES.PARTNER_AFFILIATION
    );

    const relation = await commonTypeRepository.findOrCreate(
      payload.relation_id,
      authenticatedUser.relation_id,
      COMMON_TYPES.PARTNER_RELATION
    );

    const acquisition = await commonTypeRepository.findOrCreate(
      payload.acquisition_id,
      authenticatedUser.relation_id,
      COMMON_TYPES.PARTNER_ACQUISITION
    );

    const createPartnerCompany = await partnerRepository.create({
      name: payload.name,
      location_id: location.id,
      ...locationInfo,
      website: payload.website,
      phone: payload.phone,
      email: payload.email,
      price_rate: payload.price_rate,
      authorized_country_ids: payload.authorized_country_ids,
      authorized_country_name: authorizedCountriesName,
      coverage_beyond: payload.coverage_beyond,
      remark: payload.remark,
      affiliation_id: affiliation.id,
      relation_id: relation.id,
      acquisition_id: acquisition.id,
      affiliation_name: affiliation.name,
      relation_name: relation.name,
      acquisition_name: acquisition.name,
    });

    if (!createPartnerCompany)
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);

    return successResponse({
      data: {
        ...createPartnerCompany,
        authorizedCountries:
          mappingAuthorizedCountriesName(authorizedCountries),
      },
    });
  };

  public async getList(
    authenticatedUser: UserAttributes,
    limit: number,
    offset: number,
    _filter: any,
    sort: "name" | "country_name" | "city_name",
    order: SortOrder
  ) {
    const { partners, pagination } =
      await partnerRepository.getListPartnerCompanyWithPagination(
        limit,
        offset,
        sort,
        order,
        authenticatedUser.relation_id
      );

    return successResponse({
      data: {
        partners,
        pagination,
      },
    });
  }
}

export default new PartnerService();
