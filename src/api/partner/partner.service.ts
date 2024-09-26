import { mappingAuthorizedCountriesName } from "@/api/distributor/distributor.mapping";
import { locationService } from "@/api/location/location.service";
import { PartnerRequest, PartnerResponse } from "@/api/partner/partner.type";
import {
  ASSOCIATION,
  COMMON_TYPES,
  DEFAULT_UNEMPLOYED_COMPANY_NAME,
  MESSAGES,
} from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { locationRepository } from "@/repositories/location.repository";
import partnerRepository from "@/repositories/partner.repository";
import { partnerContactRepository } from "@/repositories/partner_contact.repository";
import { countryStateCityService } from "@/services/country_state_city.service";
import {
  CommonTypeAttributes,
  ICountryStateCity,
  SortOrder,
  UserAttributes,
} from "@/types";
import { PartnerAttributes } from "@/types/partner.type";
import { isEqual, pick } from "lodash";

const AFFILIATION = ASSOCIATION.AFFILIATION.map((item) => item.toLowerCase());
const RELATION = ASSOCIATION.RELATION.map((item) => item.toLowerCase());
const ACQUISITION = ASSOCIATION.ACQUISITION.map((item) => item.toLowerCase());

class PartnerService {
  private validateAssociation(payload: PartnerRequest) {
    if (AFFILIATION.includes(payload.affiliation_id?.toLowerCase()))
      return MESSAGES.PARTNER.AFFILIATION_EXISTS;

    if (RELATION.includes(payload.relation_id?.toLowerCase()))
      return MESSAGES.PARTNER.RELATION_EXISTS;

    if (ACQUISITION.includes(payload.acquisition_id?.toLowerCase()))
      return MESSAGES.PARTNER.ACQUISITION_EXISTS;

    return undefined;
  }

  public create = async (
    authenticatedUser: UserAttributes,
    payload: PartnerRequest
  ) => {
    const isValidGeoLocation = await locationService.validateGeoLocation(
      payload
    );

    if (isValidGeoLocation !== true) return isValidGeoLocation;

    const existedPartner = await partnerRepository.findDuplicatePartnerByName(
      authenticatedUser.relation_id,
      payload.name
    );

    if (existedPartner)
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_EXISTED);

    if (
      DEFAULT_UNEMPLOYED_COMPANY_NAME.toLowerCase() ===
      payload.name.toLowerCase()
    )
      return errorMessageResponse(
        "The unemployed name is not valid; please choose another company name."
      );

    const authorizedCountriesName =
      await locationService.getAuthorizedCountriesName(payload);

    if (!authorizedCountriesName)
      return errorMessageResponse("Not authorized countries, please check ids");

    const validationError = this.validateAssociation(payload);
    if (validationError) return errorMessageResponse(validationError);

    const { affiliation, relation, acquisition } =
      await this.createPartnerRelations(payload, authenticatedUser);

    const createPartnerCompany = await this.createPartnerCompany(
      payload,
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
        authorized_countries: authorizedCountriesName,
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
    authorizedCountriesName: string,
    affiliation: CommonTypeAttributes,
    relation: CommonTypeAttributes,
    acquisition: CommonTypeAttributes,
    authenticatedUser: UserAttributes
  ) => {
    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

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

    if (!location) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    return await partnerRepository.create({
      name: payload.name,
      website: payload.website,
      phone: payload.phone,
      email: payload.email,
      price_rate: payload.price_rate,
      authorized_country_ids: payload.authorized_country_ids,
      authorized_country_name: authorizedCountriesName,
      coverage_beyond: payload.coverage_beyond,
      remark: payload.remark,
      affiliation_id: affiliation?.id,
      relation_id: relation?.id,
      acquisition_id: acquisition?.id,
      affiliation_name: affiliation?.name,
      relation_name: relation?.name,
      acquisition_name: acquisition?.name,
      brand_id: authenticatedUser.relation_id,
      location_id: location?.id,
      ...locationInfo,
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

  public async getOne(id: string, authenticatedUser: UserAttributes) {
    const { partner } = await partnerRepository.getOnePartnerCompany(
      id,
      authenticatedUser.relation_id
    );

    if (!partner)
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);

    return successResponse({
      data: partner,
    });
  }

  public async update(
    id: string,
    payload: PartnerRequest,
    user: UserAttributes
  ) {
    const partner = await this.getPartner(id, user);

    const brand = await brandRepository.find(user.relation_id);
    if (!brand)
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404);

    const existedPartner = await partnerRepository.findDuplicatePartnerByName(
      user.relation_id,
      payload.name,
      id
    );

    if (existedPartner)
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_EXISTED);

    if (
      DEFAULT_UNEMPLOYED_COMPANY_NAME.toLowerCase() ===
      payload.name.toLowerCase()
    )
      return errorMessageResponse(
        "The unemployed name is not valid; please choose another company name."
      );

    const locationInfo: any = await this.updateLocation(
      payload,
      partner as PartnerAttributes
    );
    if (locationInfo.statusCode) {
      return locationInfo;
    }

    const authorizedCountriesName = await this.updateAuthorizedCountries(
      payload,
      partner as PartnerAttributes
    );

    if (typeof authorizedCountriesName !== "string")
      return authorizedCountriesName;

    const validationError = this.validateAssociation(payload);
    if (validationError) return errorMessageResponse(validationError);

    const { affiliation, relation, acquisition } =
      await this.createPartnerRelations(payload, user);

    const updatedPartner = await this.updatePartner(
      id,
      payload,
      locationInfo,
      authorizedCountriesName,
      affiliation,
      relation,
      acquisition
    );

    if (!updatedPartner)
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);

    return successResponse({
      data: {
        ...updatedPartner,
        authorized_countries: authorizedCountriesName,
      },
    });
  }

  private async getPartner(id: string, user: UserAttributes) {
    const { partner } = await partnerRepository.getOnePartnerCompany(
      id,
      user.relation_id
    );
    if (!partner)
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND);
    return partner;
  }

  private async updateLocation(
    payload: PartnerRequest,
    partner: PartnerAttributes
  ) {
    const locationHaveUpdated = !isEqual(
      pick(payload, ["country_id", "state_id", "city_id"]),
      pick(partner, ["country_id", "state_id", "city_id"])
    );

    if (!locationHaveUpdated) return {};

    const isValidGeoLocation = await locationService.validateGeoLocation(
      payload
    );
    if (isValidGeoLocation !== true) return isValidGeoLocation;

    const projectLocation = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    const locationInfo = {
      ...projectLocation,
      address: payload.address,
      postal_code: payload.postal_code,
    };

    const updatedLocation = await locationRepository.findAndUpdate(
      partner.location_id,
      locationInfo
    );
    if (!updatedLocation)
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);

    return locationInfo;
  }

  private async updateAuthorizedCountries(
    payload: PartnerRequest,
    partner: PartnerAttributes
  ) {
    if (
      isEqual(payload.authorized_country_ids, partner.authorized_country_ids)
    ) {
      return partner.authorized_country_name;
    }

    const authorizedCountries = await countryStateCityService.getCountries(
      payload.authorized_country_ids
    );
    if (!authorizedCountries)
      return errorMessageResponse("Not authorized countries, please check ids");

    return mappingAuthorizedCountriesName(authorizedCountries);
  }

  private async updatePartner(
    id: string,
    payload: PartnerRequest,
    locationInfo: Partial<
      ICountryStateCity & { address: string; postal_code: string }
    >,
    authorizedCountriesName: string,
    affiliation: CommonTypeAttributes,
    relation: CommonTypeAttributes,
    acquisition: CommonTypeAttributes
  ) {
    const data = {
      ...payload,
      ...locationInfo,
      authorized_country_name: authorizedCountriesName,
      affiliation_id: affiliation.id,
      relation_id: relation.id,
      acquisition_id: acquisition.id,
      affiliation_name: affiliation.name,
      relation_name: relation.name,
      acquisition_name: acquisition.name,
    };

    return await partnerRepository.update(id, data);
  }

  public async delete(id: string) {
    const foundPartner = await partnerRepository.findAndDelete(id);

    if (!foundPartner)
      return errorMessageResponse(MESSAGES.PARTNER.PARTNER_NOT_FOUND, 404);

    await partnerContactRepository.updateContactToUnemployed(
      id,
      foundPartner[0].brand_id
    );

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getCompanySummary(brandId: string) {
    const data = await partnerRepository.getCompanySummary(brandId);

    return successResponse({
      data: {
        ...data,
        unemployed_company: {
          id: brandId,
          name: DEFAULT_UNEMPLOYED_COMPANY_NAME,
        },
      },
    });
  }
}

export default new PartnerService();
