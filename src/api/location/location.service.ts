import { mappingAuthorizedCountriesName } from "@/api/distributor/distributor.mapping";
import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { locationRepository } from "@/repositories/location.repository";
import productRepository from "@/repositories/product.repository";
import { userRepository } from "@/repositories/user.repository";
import { countryStateCityService } from "@/services/country_state_city.service";
import {
  CompanyFunctionalGroup,
  DesignFirmFunctionalType,
  ILocationAttributes,
  IMessageResponse,
  LocationRequest,
  LocationWithTeamCountAndFunctionType,
  SortOrder,
  UserAttributes,
  UserType,
  WarehouseStatus,
} from "@/types";
import { isEqual } from "lodash";
import { v4 as uuid } from "uuid";
import { warehouseService } from "../warehouses/warehouse.service";
import {
  getDesignFunctionType,
  mappingByCountries,
  sortMainOfficeFirst,
} from "./location.mapping";
import { warehouseRepository } from "@/repositories/warehouse.repository";

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
    const isValidGeoLocation = await this.validateGeoLocation(payload);

    if (isValidGeoLocation !== true) return isValidGeoLocation;

    const locationId = uuid();

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

    const functionalType =
      functionalTypes?.map((item) => item.name).join(", ") || "";

    const isLogistic = functionalType
      .toLowerCase()
      .includes(CompanyFunctionalGroup.LOGISTIC.toLowerCase());

    if (isLogistic) {
      const createdWarehouse = await warehouseService.createMultiple(user, {
        id: locationId,
        business_name: payload.business_name,
      });

      if (!createdWarehouse) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
      }
    }

    const createdLocation = await locationRepository.create({
      business_name: payload.business_name,
      functional_type_ids: functionalTypes?.map((item) => item.id) || [],
      business_number:
        user.type === UserType.Designer ? "" : payload.business_number,
      functional_type: functionalType,
      ...countryStateCity,
      address: payload.address,
      postal_code: payload.postal_code,
      general_phone: payload.general_phone,
      general_email: payload.general_email,
      type: user.type,
      relation_id: user.relation_id,
      id: locationId,
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
    const isValidGeoLocation = await this.validateGeoLocation(payload);

    if (isValidGeoLocation !== true) return isValidGeoLocation;

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

    const functionalType =
      functionalTypes?.map((item) => item.name).join(", ") || "";

    const existedWarehouse = await warehouseRepository.findBy({
      location_id: id,
    });

    if (!existedWarehouse) {
      const createdWarehouse = await warehouseService.createMultiple(user, {
        business_name: payload.business_name,
        id,
      });

      if (createdWarehouse.statusCode !== 200) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
      }
    } else {
      const warehouseStatusUpdate =
        await warehouseService.updateWarehouseByLocation([id], {
          name: payload?.business_name ?? undefined,
          status: functionalType
            .toLowerCase()
            .includes(CompanyFunctionalGroup.LOGISTIC.toLowerCase())
            ? WarehouseStatus.ACTIVE
            : WarehouseStatus.INACTIVE,
        });

      if (warehouseStatusUpdate.statusCode !== 200) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
      }
    }

    const updatedLocation = await locationRepository.update(id, {
      business_name: payload.business_name,
      business_number:
        user.type === UserType.Designer ? "" : payload.business_number,
      functional_type: functionalType,
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

  public get = async (
    id: string
  ): Promise<{
    data?: LocationWithTeamCountAndFunctionType;
    statusCode: number;
    message?: string;
  }> => {
    const location =
      await locationRepository.findWithCountMemberAndFunctionType(id);
    if (!location) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND, 404);
    }
    return successResponse({ data: location });
  };

  public getList = async (
    user: UserAttributes,
    options?: {
      limit?: number;
      offset?: number;
      sort?: string;
      order?: SortOrder;
      is_sort_main_office_first?: boolean;
      functional_type?: string;
      filter?: any;
    }
  ): Promise<{
    data: {
      locations: LocationWithTeamCountAndFunctionType[];
      pagination: any;
    };
    statusCode: number;
  }> => {
    const {
      limit,
      offset,
      sort,
      order,
      is_sort_main_office_first = false,
      functional_type,
    } = options || {};

    const response = await locationRepository.getLocationPagination(
      user.relation_id,
      limit,
      offset,
      sort,
      order
    );

    let locations = response.data;

    if (is_sort_main_office_first) {
      locations = sortMainOfficeFirst(response.data);
    }

    if (functional_type) {
      locations = locations.filter((location) =>
        location.functional_type
          .toLowerCase()
          .includes(functional_type.toLowerCase())
      );
    }

    return successResponse({
      data: {
        locations,
        pagination: response.pagination,
      },
    }) as any;
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

    const updateInActiveWarehouses =
      await warehouseService.updateWarehouseByLocation([id]);

    if (updateInActiveWarehouses.statusCode !== 200) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    await locationRepository.delete(id);

    return successMessageResponse(MESSAGES.SUCCESS);
  };

  // this function is only for Brand & Design Firm Account
  public createDefaultLocation = async (
    relationId: string,
    type: UserType,
    email: string,
    ipAddress?: string
  ) => {
    const country = await countryStateCityService.findCountryByIpAddress(
      ipAddress
    );
    const functionTypes = await this.getFunctionalType(
      type,
      null,
      type === UserType.Brand
        ? ["Headquarter"]
        : [DesignFirmFunctionalType.MainOffice]
    );

    return locationRepository.create({
      business_name: "Company Name",
      functional_type_ids: functionTypes
        ? functionTypes.map((item) => item.id)
        : [""],
      business_number: "",
      functional_type: functionTypes?.map((item) => item.name).join(", ") || "",
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

  public validateGeoLocation = async (payload: {
    country_id: string;
    city_id?: string;
    state_id?: string;
  }) => {
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

    return true;
  };

  public getGeoLocation = async (payload: {
    country_id: string;
    city_id?: string;
    state_id?: string;
  }) => {
    const isValidGeoLocation =
      await countryStateCityService.validateLocationData(
        payload.country_id,
        payload.city_id,
        payload.state_id
      );

    if (isValidGeoLocation !== true) return { data: null };

    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    if (!countryStateCity) return { data: null };

    return {
      data: countryStateCity,
    };
  };

  public getAuthorizedCountriesName = async (payload: {
    authorized_country_ids: string[];
  }) => {
    const authorizedCountries = await countryStateCityService.getCountries(
      payload.authorized_country_ids
    );

    if (!authorizedCountries) return null;

    return mappingAuthorizedCountriesName(authorizedCountries);
  };
}
export const locationService = new LocationService();
