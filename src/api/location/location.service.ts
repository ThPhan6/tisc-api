import { COMMON_TYPES, MESSAGES, SYSTEM_TYPE } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { locationRepository } from "@/repositories/location.repository";
import { marketAvailabilityRepository } from "@/repositories/market_availability.repository";
import productRepository from "@/repositories/product.repository";
import { userRepository } from "@/repositories/user.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import {
  ILocationAttributes,
  IMessageResponse,
  LocationRequest,
  LocationType,
  SortOrder,
  UserAttributes,
  UserType,
} from "@/types";
import { head, isEqual } from "lodash";
import { getDesignFunctionType, mappingByCountries } from "./location.mapping";

export default class LocationService {
  private async getFunctionalType(
    user: UserAttributes,
    functional_type_ids: string[]
  ) {
    if (user.type !== SYSTEM_TYPE.DESIGN) {
      return Promise.all(
        functional_type_ids.map((id) => {
          return commonTypeRepository.findOrCreate(
            id,
            user.relation_id,
            COMMON_TYPES.COMPANY_FUNCTIONAL
          );
        })
      );
    }
    return getDesignFunctionType(functional_type_ids);
  }

  private mappingLocationData = async (locations: ILocationAttributes[]) => {
    return Promise.all(
      locations.map(async (location) => {
        const totalUser = await userRepository.countUserInLocation(location.id);
        const functionalTypeOption = getDesignFunctionType(
          location.functional_type_ids
        );
        let functionalTypes;
        if (functionalTypeOption) {
          functionalTypes = functionalTypeOption;
        } else {
          functionalTypes = await commonTypeRepository.getByListIds(
            location.functional_type_ids
          );
        }
        return {
          ...location,
          functional_types: functionalTypes,
          teams: totalUser,
        };
      })
    );
  };

  public getFunctionalTypes = async (user: UserAttributes) => {
    const functionTypes = await commonTypeRepository.getAllByRelationAndType(
      user.relation_id,
      COMMON_TYPES.COMPANY_FUNCTIONAL
    );
    return successResponse({ data: functionTypes });
  };

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
      user,
      payload.functional_type_ids
    );

    const createdLocation = await locationRepository.create({
      business_name: payload.business_name,
      functional_type_ids: functionalTypes.map((item) => item.id),
      business_number:
        user.type === SYSTEM_TYPE.DESIGN ? "" : payload.business_number,
      functional_type: functionalTypes.map((item) => item.name).join(", "),
      ...countryStateCity,
      address: payload.address,
      postal_code: payload.postal_code,
      general_phone: payload.general_phone,
      general_email: payload.general_email,
      type:
        user.type === UserType.Brand
          ? LocationType.brand
          : user.type === UserType.Designer
          ? LocationType.designer
          : undefined,
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
      user,
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
        user.type === SYSTEM_TYPE.DESIGN ? "" : payload.business_number,
      functional_type: functionalTypes.map((item) => item.name).join(", "),
      functional_type_ids: functionalTypes.map((item) => item.id),
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
    const location = await locationRepository.find(id);
    if (!location) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND, 404);
    }
    const locationData = await this.mappingLocationData([location]);
    return successResponse({ data: head(locationData) });
  };

  public getList = async (
    user: UserAttributes,
    limit?: number,
    offset?: number,
    sort?: string,
    order?: SortOrder,
    _filter?: any
  ) => {
    const response = await locationRepository.getLocationPagination(
      limit,
      offset,
      user.relation_id,
      sort,
      order
    );
    response.data = await this.mappingLocationData(response.data);
    return successResponse({
      data: {
        locations: response.data,
        pagination: response.pagination,
      },
    });
  };

  public getListWithGroup = async (user: UserAttributes) => {
    return this.getCompanyLocationGroupByCountry(user.relation_id);
  };

  public getCompanyLocationGroupByCountry = async (
    relationId: string | null
  ) => {
    const response = await locationRepository.getLocationPagination(
      undefined,
      undefined,
      relationId,
      "country_name"
    );
    /// format data
    const locations = await this.mappingLocationData(response.data);
    return successResponse({
      data: mappingByCountries(locations),
    });
  };

  public getMarketLocationGroupByCountry = async (productId: string) => {
    const product = await productRepository.find(productId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const market =
      await marketAvailabilityRepository.findMarketAvailabilityByCollection(
        product.collection_id
      );
    if (!market) {
      return successResponse({ data: [] });
    }

    const locations =
      await locationRepository.getLocationByRelationAndCountryIds(
        product.brand_id,
        market.country_ids
      );
    const locationData = await this.mappingLocationData(locations);
    return successResponse({
      data: mappingByCountries(locationData, true),
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

  public createDefaultLocation = async (
    relationId: string,
    type: number,
    email: string
  ) => {
    return locationRepository.create({
      business_name: "Global",
      functional_type_ids: [""],
      business_number: "",
      functional_type: "",
      country_id: "-1",
      country_name: "Global",
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
