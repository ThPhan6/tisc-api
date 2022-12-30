import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { locationRepository } from "@/repositories/location.repository";
import productRepository from "@/repositories/product.repository";
import { userRepository } from "@/repositories/user.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import {
  ILocationAttributes,
  IMessageResponse,
  LocationRequest,
  SortOrder,
  UserAttributes,
  UserType,
  DesignFirmFunctionalType,
} from "@/types";
import { isEqual } from "lodash";
import {
  getDesignFunctionType,
  mappingByCountries,
  sortMainOfficeFirst,
} from "./location.mapping";

export default class LocationService {
  private async getFunctionalType(
    type: UserType,
    relationId: null | string,
    functional_type_ids: string[]
  ) {
    if (type !== UserType.Designer) {
      return Promise.all(
        functional_type_ids.map((id) => {
          return commonTypeRepository.findOrCreate(
            id,
            relationId,
            COMMON_TYPES.COMPANY_FUNCTIONAL
          );
        })
      );
    }
    return getDesignFunctionType(functional_type_ids);
  }

  public create = async (user: UserAttributes, payload: LocationRequest) => {
    const isValidGeoLocation =
      await countryStateCityService.validateLocationData(
        payload.country_id,
        payload.city_id,
        payload.state_id
      );

    if (isValidGeoLocation !== true) {
      return isValidGeoLocation;
    }

    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    const functionalTypes = await this.getFunctionalType(
      user.type,
      user.relation_id,
      payload.functional_type_ids
    );

    const createdLocation = await locationRepository.create({
      business_name: payload.business_name,
      functional_type_ids: functionalTypes?.map((item) => item.id) || [],
      business_number:
        user.type === UserType.Designer ? "" : payload.business_number,
      functional_type:
        functionalTypes?.map((item) => item.name).join(", ") || "",
      ...countryStateCity,
      address: payload.address,
      postal_code: payload.postal_code,
      general_phone: payload.general_phone,
      general_email: payload.general_email,
      type: user.type,
      relation_id: user.relation_id,
    });
    if (!createdLocation) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return this.get(createdLocation.id);
  };

  public update = async (
    user: UserAttributes,
    id: string,
    payload: LocationRequest
  ) => {
    const isValidGeoLocation =
      await countryStateCityService.validateLocationData(
        payload.country_id,
        payload.city_id,
        payload.state_id
      );

    if (isValidGeoLocation !== true) {
      return isValidGeoLocation;
    }

    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    const functionalTypes = await this.getFunctionalType(
      user.type,
      user.relation_id,
      payload.functional_type_ids
    );

    const location = await locationRepository.find(id);
    if (!location) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND, 404);
    }
    if (
      isEqual(user.type, location.type) === false ||
      user.relation_id !== location.relation_id
    ) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE, 404);
    }

    const updatedLocation = await locationRepository.update(id, {
      business_name: payload.business_name,
      business_number:
        user.type === UserType.Designer ? "" : payload.business_number,
      functional_type:
        functionalTypes?.map((item) => item.name).join(", ") || "",
      functional_type_ids: functionalTypes?.map((item) => item.id) || [],
      ...countryStateCity,
      address: payload.address,
      postal_code: payload.postal_code,
      general_phone: payload.general_phone,
      general_email: payload.general_email,
    });
    if (!updatedLocation) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    return this.get(id);
  };

  public get = async (id: string) => {
    const location =
      await locationRepository.findWithCountMemberAndFunctionType(id);
    if (!location) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND, 404);
    }
    return successResponse({ data: location });
  };

  public getList = async (
    user: UserAttributes,
    limit: number,
    offset: number,
    sort?: string,
    order?: SortOrder,
    _filter?: any,
    is_sort_main_office_first?: boolean
  ) => {
    const response = await locationRepository.getLocationPagination(
      user.relation_id,
      limit,
      offset,
      sort,
      order
    );
    return successResponse({
      data: {
        locations: is_sort_main_office_first
          ? sortMainOfficeFirst(response.data)
          : response.data,
        pagination: response.pagination,
      },
    });
  };

  public getListWithGroup = async (user: UserAttributes) => {
    return this.getCompanyLocationGroupByCountry(user.relation_id);
  };

  public getCompanyLocationGroupByCountry = async (relationId: string) => {
    const response = await locationRepository.getLocationPagination(
      relationId,
      undefined,
      undefined,
      "country_name"
    );
    /// format data
    return successResponse({
      data: mappingByCountries(response.data),
    });
  };

  public getMarketLocationGroupByCountry = async (productId: string) => {
    const product = await productRepository.find(productId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    //
    const response = await locationRepository.getLocationPagination(
      product.brand_id
    );
    return successResponse({
      data: mappingByCountries(response.data, true),
    });
  };

  public delete = async (
    user: UserAttributes,
    id: string
  ): Promise<IMessageResponse> => {
    const location = await locationRepository.find(id);
    if (!location) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND, 404);
    }

    if (user.relation_id !== location.relation_id) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
    }
    const totalUserInLocation = await userRepository.countUserInLocation(
      location.id
    );
    if (totalUserInLocation > 0) {
      return errorMessageResponse(MESSAGES.LOCATION.USER_USED);
    }

    await locationRepository.delete(id);
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  // this function is only for Brand & Design Firm Account
  public createDefaultLocation = async (
    relationId: string,
    type: UserType,
    email: string,
    ipAddress?: string,
  ) => {
    const country = await countryStateCityService.findCountryByIpAddress(ipAddress);
    const functionTypes = await this.getFunctionalType(
      type,
      null,
      type === UserType.Brand ? ['Headquarter'] : [DesignFirmFunctionalType.MainOffice]
    );

    return locationRepository.create({
      business_name: "Company Name",
      functional_type_ids: functionTypes ? functionTypes.map((item) => item.id) : [""],
      business_number: "",
      functional_type: functionTypes?.map((item) => item.name).join(', ') || '',
      country_id: country.id,
      country_name: country.name,
      state_id: "",
      state_name: "",
      city_id: "",
      city_name: "",
      phone_code: "",
      address: "",
      postal_code: "",
      general_phone: "",
      general_email: email,
      type,
      relation_id: relationId,
    });
  };

  public upsertLocation = async (
    payload: Partial<ILocationAttributes>,
    locationId?: string
  ) => {
    const { city_id, country_id = "", state_id } = payload;
    const isValidGeoLocation =
      await countryStateCityService.validateLocationData(
        country_id,
        city_id,
        state_id
      );

    if (isValidGeoLocation !== true) {
      return {
        error: isValidGeoLocation,
      };
    }

    const fullLocation = await countryStateCityService.getCountryStateCity(
      country_id,
      city_id,
      state_id
    );

    if (!fullLocation) {
      return {
        error: errorMessageResponse(
          MESSAGES.COUNTRY_STATE_CITY.COUNTRY_STATE_CITY_NOT_FOUND
        ),
      };
    }

    const locationInfo = {
      ...fullLocation,
      ...payload,
    };

    const upsertLocation: ILocationAttributes = await (locationId
      ? locationRepository.findAndUpdate(locationId, locationInfo)
      : locationRepository.create(locationInfo));

    if (!upsertLocation) {
      return {
        error: errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE),
      };
    }

    return { location: upsertLocation };
  };
}
export const locationService = new LocationService();
