import { locationService } from "@/api/location/location.service";
import { PartnerRequest, PartnerResponse } from "@/api/partner/partner.type";
import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import partnerRepository from "@/repositories/partner.repository";
import {
  CommonTypeAttributes,
  LocationInfo,
  SortOrder,
  UserAttributes,
} from "@/types";

class PartnerService {
  public create = async (
    authenticatedUser: UserAttributes,
    payload: PartnerRequest
  ) => {
    const isValidGeoLocation = await locationService.validateGeoLocation(
      payload
    );

    if (isValidGeoLocation !== true) return isValidGeoLocation;

    const locationInfo = await locationService.createLocationGeneralInfo(
      payload
    );

    if (!locationInfo)
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);

    const authorizedCountriesName =
      await locationService.getAuthorizedCountriesName(payload);

    if (!authorizedCountriesName)
      return errorMessageResponse("Not authorized countries, please check ids");

    const { affiliation, relation, acquisition } =
      await this.createPartnerRelations(payload, authenticatedUser);

    const createPartnerCompany = await this.createPartnerCompany(
      payload,
      locationInfo as LocationInfo,
      authorizedCountriesName,
      affiliation,
      relation,
      acquisition,
      authenticatedUser
    );

    if (!createPartnerCompany)
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);

    return successResponse({
      data: {
        ...createPartnerCompany,
        authorizedCountries: authorizedCountriesName,
      },
    });
  };

  public createPartnerRelations = async (
    payload: PartnerRequest,
    authenticatedUser: UserAttributes
  ) => {
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

    return { affiliation, relation, acquisition };
  };

  public createPartnerCompany = async (
    payload: PartnerRequest,
    locationInfo: LocationInfo,
    authorizedCountriesName: string,
    affiliation: CommonTypeAttributes,
    relation: CommonTypeAttributes,
    acquisition: CommonTypeAttributes,
    authenticatedUser: UserAttributes
  ) => {
    return await partnerRepository.create({
      name: payload.name,
      location_id: locationInfo.id,
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
      brand_id: authenticatedUser.relation_id,
    });
  };

  public async getList(
    authenticatedUser: UserAttributes,
    limit: number,
    offset: number,
    filter: {
      affiliation_id?: string;
      relation_id?: string;
      acquisition_id?: string;
    } = {},
    sort: "name" | "country_name" | "city_name",
    order: SortOrder
  ): Promise<PartnerResponse> {
    const { partners, pagination } =
      await partnerRepository.getListPartnerCompanyWithPagination(
        limit,
        offset,
        sort,
        order,
        authenticatedUser.relation_id,
        filter
      );

    return {
      data: {
        partners,
        pagination,
      },
      statusCode: 200,
    };
  }
}

export default new PartnerService();
