import LocationModel, {
  ILocationAttributes,
  LOCATION_NULL_ATTRIBUTES,
} from "../../model/location.model";
import FunctionalTypeModel, {
  FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
} from "../../model/functional_type.model";
import UserModel from "../../model/user.model";
import {
  ICitiesResponse,
  ICityResponse,
  ICountriesResponse,
  ICountryResponse,
  IFunctionalTypesResponse,
  ILocation,
  ILocationRequest,
  ILocationResponse,
  ILocationsResponse,
  IStateResponse,
  IStatesResponse,
  LocationsWithGroupResponse,
} from "./location.type";
import { IMessageResponse } from "../../type/common.type";
import { MESSAGES } from "../../constant/common.constant";
import CountryStateCityService from "../../service/country_state_city.service";
import { ICityAttributes } from "../../model/city";

export default class LocationService {
  private locationModel: LocationModel;
  private functionalTypeModel: FunctionalTypeModel;
  private countryStateCityService: CountryStateCityService;
  private userModel: UserModel;
  constructor() {
    this.locationModel = new LocationModel();
    this.functionalTypeModel = new FunctionalTypeModel();
    this.countryStateCityService = new CountryStateCityService();
    this.userModel = new UserModel();
  }
  public getFunctionalTypes = (
    user_id: string
  ): Promise<IFunctionalTypesResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const rawFunctionalTypes = await this.functionalTypeModel.getAllBy(
        { type: 0 },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      const functionalTypes = await this.functionalTypeModel.getAllBy(
        { type: user.type, relation_id: user.relation_id },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: rawFunctionalTypes.concat(functionalTypes),
        statusCode: 200,
      });
    });
  };
  public create = (
    user_id: string,
    payload: ILocationRequest
  ): Promise<ILocationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      //check functional types
      const functional_type_ids = await Promise.all(
        payload.functional_type_ids.map(async (function_type_id) => {
          const functional_type = await this.functionalTypeModel.find(
            function_type_id
          );
          if (!functional_type) {
            const createdFunctionalType = await this.functionalTypeModel.create(
              {
                ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
                name: function_type_id,
                type: user.type,
                relation_id: user.relation_id,
              }
            );
            return createdFunctionalType ? createdFunctionalType.id : "";
          }
          return function_type_id;
        })
      );
      const countryStateCity =
        await this.countryStateCityService.getCountryStateCity(
          payload.country_id,
          payload.city_id,
          payload.state_id
        );
      const createdLocation = await this.locationModel.create({
        ...LOCATION_NULL_ATTRIBUTES,
        business_name: payload.business_name,
        business_number: payload.business_number,
        functional_type_ids,
        country_id: payload.country_id,
        state_id: payload.state_id,
        city_id: payload.city_id,
        country_name: countryStateCity?.country_name || "",
        state_name: countryStateCity?.state_name || "",
        city_name: countryStateCity?.city_name || "",
        phone_code: countryStateCity.phone_code,
        address: payload.address,
        postal_code: payload.postal_code,
        general_phone: payload.general_phone,
        general_email: payload.general_email,
        type: user.type,
        relation_id: user.relation_id,
      });
      if (!createdLocation) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(createdLocation.id));
    });
  };
  public update = (
    user_id: string,
    id: string,
    payload: ILocationRequest
  ): Promise<ILocationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const location = await this.locationModel.find(id);
      if (!location) {
        return resolve({
          message: MESSAGES.LOCATION_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (
        user.type !== location.type ||
        user.relation_id !== location.relation_id
      ) {
        return resolve({
          message: MESSAGES.USER_NOT_IN_WORKSPACE,
          statusCode: 400,
        });
      }
      //check functional types
      const functional_type_ids = await Promise.all(
        payload.functional_type_ids.map(async (function_type_id) => {
          const functional_type = await this.functionalTypeModel.find(
            function_type_id
          );
          if (!functional_type) {
            const createdFunctionalType = await this.functionalTypeModel.create(
              {
                ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
                name: function_type_id,
                type: user.type,
                relation_id: user.relation_id,
              }
            );
            return createdFunctionalType ? createdFunctionalType.id : "";
          }
          return function_type_id;
        })
      );
      const countryStateCity =
        await this.countryStateCityService.getCountryStateCity(
          payload.country_id,
          payload.city_id,
          payload.state_id
        );
      const updatedLocation = await this.locationModel.update(id, {
        business_name: payload.business_name,
        business_number: payload.business_number,
        functional_type_ids,
        country_id: payload.country_id,
        state_id: payload.state_id,
        city_id: payload.city_id,
        country_name: countryStateCity?.country_name || "",
        state_name: countryStateCity?.state_name || "",
        city_name: countryStateCity?.city_name || "",
        phone_code: countryStateCity.phone_code,
        address: payload.address,
        postal_code: payload.postal_code,
        general_phone: payload.general_phone,
        general_email: payload.general_email,
      });
      if (!updatedLocation) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(id));
    });
  };
  public get = (id: string): Promise<ILocationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const location = await this.locationModel.find(id);
      if (!location) {
        return resolve({
          message: MESSAGES.LOCATION_NOT_FOUND,
          statusCode: 404,
        });
      }

      const functionalTypes = await this.functionalTypeModel.getMany(
        location.functional_type_ids,
        ["id", "name"]
      );
      const result = {
        id: location.id,
        business_name: location.business_name,
        business_number: location.business_number,
        functional_types: functionalTypes,
        country_id: location.country_id,
        state_id: location.state_id,
        city_id: location.city_id,
        country_name: location.country_name,
        state_name: location.state_name,
        city_name: location.city_name,
        address: location.address,
        postal_code: location.postal_code,
        general_phone: location.general_phone,
        general_email: location.general_email,
        created_at: location.created_at,
        phone_code: location.phone_code,
      };
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public getAllCountry = (): Promise<ICountriesResponse> =>
    new Promise(async (resolve) => {
      const result = await this.countryStateCityService.getAllCountry();

      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  public getCountry = (id: string): Promise<ICountryResponse> =>
    new Promise(async (resolve) => {
      const result = await this.countryStateCityService.getCountryDetail(id);

      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  public getState = (id: string): Promise<IStateResponse> =>
    new Promise(async (resolve) => {
      const result = await this.countryStateCityService.getStateDetail(id);

      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  public getCity = (id: string): Promise<ICityResponse> =>
    new Promise(async (resolve) => {
      const result = await this.countryStateCityService.getCityDetail(id);

      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  public getStates = (country_id: string): Promise<IStatesResponse> =>
    new Promise(async (resolve) => {
      const result = await this.countryStateCityService.getStatesByCountry(
        country_id
      );
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  public getCities = (
    country_id: string,
    state_id?: string
  ): Promise<ICitiesResponse> =>
    new Promise(async (resolve) => {
      let cities: ICityAttributes[] = [];
      if (!state_id) {
        cities = await this.countryStateCityService.getCitiesByCountry(
          country_id
        );
      } else {
        cities = await this.countryStateCityService.getCitiesByStateAndCountry(
          country_id,
          state_id
        );
      }
      return resolve({
        data: cities,
        statusCode: 200,
      });
    });

  public getList = (
    user_id: string,
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: "ASC" | "DESC"
  ): Promise<ILocationsResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const locations = await this.locationModel.list(
        limit,
        offset,
        { ...filter, type: user.type, relation_id: user.relation_id },
        [sort, order]
      );
      const result: ILocation[] = await Promise.all(
        locations.map(async (location: ILocationAttributes) => {
          const functionalTypes = await this.functionalTypeModel.getMany(
            location.functional_type_ids,
            ["id", "name"]
          );

          const users = await this.userModel.getBy({
            location_id: location.id,
          });
          const teams = users.length;
          return {
            id: location.id,
            business_name: location.business_name,
            general_phone: location.general_phone,
            general_email: location.general_email,
            created_at: location.created_at,
            country_name: location.country_name,
            state_name: location.state_name,
            city_name: location.city_name,
            phone_code: location.phone_code,
            functional_types: functionalTypes,
            teams,
          };
        })
      );
      const pagination = await this.locationModel.getPagination(limit, offset, {
        type: user.type,
        relation_id: user.relation_id,
      });
      return resolve({
        data: {
          locations: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  public getListWithGroup = (
    user_id: string
  ): Promise<LocationsWithGroupResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const locations = await this.locationModel.getAllBy(
        { type: user.type, relation_id: user.relation_id },
        undefined,
        "country_name",
        "ASC"
      );
      const removedFields = await Promise.all(
        locations.map(async (location: ILocationAttributes) => {
          const functionalTypes = await this.functionalTypeModel.getMany(
            location.functional_type_ids,
            ["id", "name"]
          );
          return {
            id: location.id,
            business_name: location.business_name,
            address: location.address,
            postal_code: location.postal_code,
            created_at: location.created_at,
            country_name: location.country_name,
            state_name: location.state_name,
            city_name: location.city_name,
            country_id: location.country_id,
            state_id: location.state_id,
            city_id: location.city_id,
            phone_code: location.phone_code,
            functional_types: functionalTypes,
          };
        })
      );
      const distintCountries = await this.locationModel.getGroupBy(
        { type: user.type, relation_id: user.relation_id },
        "country_name",
        "count"
      );
      const result = distintCountries.map((distintCountry: any) => {
        const groupLocations = removedFields.filter(
          (item) => item.country_name === distintCountry.country_name
        );
        return {
          ...distintCountry,
          locations: groupLocations,
        };
      });
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  public delete = (user_id: string, id: string): Promise<IMessageResponse> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const location = await this.locationModel.find(id);
      if (!location) {
        return resolve({
          message: MESSAGES.LOCATION_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (
        user.type !== location.type ||
        user.relation_id !== location.relation_id
      ) {
        return resolve({
          message: MESSAGES.USER_NOT_IN_WORKSPACE,
          statusCode: 400,
        });
      }
      await this.locationModel.update(id, { is_deleted: true });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
}
