import { mappingAuthorizedCountriesName } from "@/api/distributor/distributor.mapping";
import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { locationRepository } from "@/repositories/location.repository";
import partnerRepository from "@/repositories/partner.repository";
import { countryStateCityService } from "@/services/country_state_city.service";
import { PartnerAttributes } from "@/types/partner.type";

class PartnerService {
  public create = async (payload: PartnerAttributes) => {
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

    const createPartnerCompany = await partnerRepository.create({
      name: payload.name,
      location_id: location.id,
      ...locationInfo,
      website: payload.website,
      phone: payload.phone,
      email: payload.email,
      affiliation: payload.affiliation,
      relation: payload.relation,
      acquisition: payload.acquisition,
      price_rate: payload.price_rate,
      authorized_country_ids: payload.authorized_country_ids,
      authorized_country_name: authorizedCountriesName,
      coverage_beyond: payload.coverage_beyond,
      remark: payload.remark,
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
}

export default new PartnerService();
