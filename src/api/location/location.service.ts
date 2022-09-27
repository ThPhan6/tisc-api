import { ILocationRequest } from "./location.type";
import { IMessageResponse, ILocationAttributes } from "@/types";
import { MESSAGES } from "@/constants";
import {COMMON_TYPES} from '@/constants/common.constant';
import {userRepository} from '@/repositories/user.repository';
import productRepository from '@/repositories/product.repository';
import marketAvailability from '@/repositories/market_availability.repository';
import {commonTypeRepository} from '@/repositories/common_type.repository';
import {locationRepository} from '@/repositories/location.repository';
import {countryStateCityService} from "@/service/country_state_city.service";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from '@/helper/response.helper';

import {mappingByCountries} from './location.mapping';
import {head} from 'lodash';

export default class LocationService {

  private mappingLocationData = async (locations: ILocationAttributes[]) => {
    return Promise.all(locations.map(async (location) => {
      const totalUser = await userRepository.countUserInLocation(location.id);
      const functionalTypes = await commonTypeRepository.getByListIds(location.functional_type_ids);
      return {
        ...location,
        functional_types: functionalTypes,
        teams: totalUser,
      };
    }));
  }

  public getFunctionalTypes = async (userId: string) => {
    const user = await userRepository.find(userId);
    if (!user) {
      return successResponse({data: []});
    }
    const functionTypes = await commonTypeRepository.getAllByRelationAndType(
      user.relation_id, COMMON_TYPES.COMPANY_FUNCTIONAL
    );
    return successResponse({data: functionTypes});
  }


  public create = async (
    userId: string,
    payload: ILocationRequest
  ) => {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }
    const isValidGeoLocation = await countryStateCityService.validateLocationData(
      payload.country_id,
      payload.state_id,
      payload.city_id,
    );

    if (isValidGeoLocation !== true) {
      return isValidGeoLocation;
    }

    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    const functionalTypes = await Promise.all(payload.functional_type_ids.map((id) => {
      return commonTypeRepository.findOrCreate(
        id, user.relation_id, COMMON_TYPES.COMPANY_FUNCTIONAL
      );
    }));

    const createdLocation = await locationRepository.create({
      business_name: payload.business_name,
      business_number: payload.business_number,
      functional_type_ids: functionalTypes.map((item) => item.id),
      functional_type: functionalTypes.map((item) => item.name).join(", "),
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
  }

  public update = async (
    userId: string,
    id: string,
    payload: ILocationRequest
  ) => {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }
    const isValidGeoLocation = await countryStateCityService.validateLocationData(
      payload.country_id,
      payload.state_id,
      payload.city_id,
    );

    if (isValidGeoLocation !== true) {
      return isValidGeoLocation;
    }

    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    const functionalTypes = await Promise.all(payload.functional_type_ids.map((id) => {
      return commonTypeRepository.findOrCreate(
        id, user.relation_id, COMMON_TYPES.COMPANY_FUNCTIONAL
      );
    }));

    const location = await locationRepository.find(id);
    if (!location) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND, 404);
    }
    if (
      user.type !== location.type ||
      user.relation_id !== location.relation_id
    ) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE, 404);
    }

    const updatedLocation = await locationRepository.update(id, {
      business_name: payload.business_name,
      business_number: payload.business_number,
      functional_type_ids: functionalTypes.map((item) => item.id),
      functional_type: functionalTypes.map((item) => item.name).join(", "),
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

  // public getAllCountry = (): Promise<ICountriesResponse> =>
  //   new Promise(async (resolve) => {
  //     const result = await this.countryStateCityService.getAllCountry();
  //
  //     return resolve({
  //       data: result,
  //       statusCode: 200,
  //     });
  //   });
  // public getCountry = (id: string): Promise<ICountryResponse> =>
  //   new Promise(async (resolve) => {
  //     const result = await this.countryStateCityService.getCountryDetail(id);
  //
  //     return resolve({
  //       data: result,
  //       statusCode: 200,
  //     });
  //   });
  // public getState = (id: string): Promise<IStateResponse> =>
  //   new Promise(async (resolve) => {
  //     const result = await this.countryStateCityService.getStateDetail(id);
  //
  //     return resolve({
  //       data: result,
  //       statusCode: 200,
  //     });
  //   });
  // public getCity = (id: string): Promise<ICityResponse> =>
  //   new Promise(async (resolve) => {
  //     const result = await this.countryStateCityService.getCityDetail(id);
  //
  //     return resolve({
  //       data: result,
  //       statusCode: 200,
  //     });
  //   });
  // public getStates = (country_id: string): Promise<IStatesResponse> =>
  //   new Promise(async (resolve) => {
  //     const result = await this.countryStateCityService.getStatesByCountry(
  //       country_id
  //     );
  //     return resolve({
  //       data: result,
  //       statusCode: 200,
  //     });
  //   });
  // public getCities = (
  //   country_id: string,
  //   state_id?: string
  // ): Promise<ICitiesResponse> =>
  //   new Promise(async (resolve) => {
  //     let cities: ICityAttributes[] = [];
  //     if (!state_id) {
  //       cities = await this.countryStateCityService.getCitiesByCountry(
  //         country_id
  //       );
  //     } else {
  //       cities = await this.countryStateCityService.getCitiesByStateAndCountry(
  //         country_id,
  //         state_id
  //       );
  //     }
  //     return resolve({
  //       data: cities,
  //       statusCode: 200,
  //     });
  //   });

  public getList = async (
    userId: string,
    limit?: number,
    offset?: number,
    sort?: string,
    order?: "ASC" | "DESC",
    _filter?: any
  ) => {

    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }
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
  }

  public getListWithGroup = async (userId: string) => {
    const user = await userRepository.find(userId);
    if (!user || !user.relation_id) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }
    return this.getCompanyLocationGroupByCountry(user.relation_id);
  }

  public getCompanyLocationGroupByCountry = async ( relationId: string ) => {
    const response = await locationRepository.getLocationPagination(
      undefined,
      undefined,
      relationId,
      'country_name',
    );
    /// format data
    const locations = await this.mappingLocationData(response.data);
    return successResponse({
      data: mappingByCountries(locations),
    });
  }

  public getMarketLocationGroupByCountry = async ( productId: string ) => {
    const product = await productRepository.find(productId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const market = await marketAvailability.findMarketAvailabilityByCollection(product.collection_id);
    if (!market) {
      return successResponse({data: []});
    }

    const locations = await locationRepository.getLocationByRelationAndCountryIds(
      product.brand_id,
      market.country_ids
    );
    const locationData = await this.mappingLocationData(locations);
    return successResponse({
      data: mappingByCountries(locationData, true),
    });

  }
  public delete = async (userId: string, id: string): Promise<IMessageResponse> => {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const location = await locationRepository.find(id);
    if (!location) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND, 404);
    }

    if (user.relation_id !== location.relation_id) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
    }
    await locationRepository.delete(id);
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  // public getListCountryWithRegionGroup = async () =>
  //   new Promise(async (resolve) => {
  //     const allCountry = await this.countryStateCityService.getAllCountry();
  //     const data = allCountry.reduce(
  //       (pre: any, cur) => {
  //         if (cur.region.toLowerCase() === "americas") {
  //           if (cur.subregion.toLowerCase() === "northern america")
  //             return {
  //               ...pre,
  //               n_america: pre.n_america.concat([
  //                 {
  //                   id: cur.id,
  //                   name: cur.name,
  //                   phone_code: cur.phone_code,
  //                 },
  //               ]),
  //             };
  //           else
  //             return {
  //               ...pre,
  //               s_america: pre.s_america.concat([
  //                 {
  //                   id: cur.id,
  //                   name: cur.name,
  //                   phone_code: cur.phone_code,
  //                 },
  //               ]),
  //             };
  //         }
  //         if (cur.region.toLowerCase() === "asia")
  //           return {
  //             ...pre,
  //             asia: pre.asia.concat([
  //               {
  //                 id: cur.id,
  //                 name: cur.name,
  //                 phone_code: cur.phone_code,
  //               },
  //             ]),
  //           };
  //         if (cur.region.toLowerCase() === "africa")
  //           return {
  //             ...pre,
  //             africa: pre.africa.concat([
  //               {
  //                 id: cur.id,
  //                 name: cur.name,
  //                 phone_code: cur.phone_code,
  //               },
  //             ]),
  //           };
  //         if (cur.region.toLowerCase() === "oceania")
  //           return {
  //             ...pre,
  //             oceania: pre.oceania.concat([
  //               {
  //                 id: cur.id,
  //                 name: cur.name,
  //                 phone_code: cur.phone_code,
  //               },
  //             ]),
  //           };
  //         return {
  //           ...pre,
  //           europe: pre.europe.concat([
  //             {
  //               id: cur.id,
  //               name: cur.name,
  //               phone_code: cur.phone_code,
  //             },
  //           ]),
  //         };
  //       },
  //       {
  //         africa: [],
  //         asia: [],
  //         europe: [],
  //         n_america: [],
  //         oceania: [],
  //         s_america: [],
  //       }
  //     );
  //     const keys = Object.keys(data);
  //     const result = keys.map((key) => ({
  //       name: this.getRegionName(key),
  //       count: data[key].length,
  //       countries: data[key],
  //     }));
  //     return resolve({
  //       data: result,
  //       statusCode: 200,
  //     });
  //   });
}
