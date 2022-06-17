import LocationModel, {
  ILocationAttributes,
  LOCATION_NULL_ATTRIBUTES,
} from "../../model/location.model";
import FunctionalTypeModel, {
  FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
} from "../../model/functional_type.model";
import UserModel from "../../model/user.model";
import {
  ICountriesResponse,
  IFunctionalTypesResponse,
  ILocation,
  ILocationRequest,
  ILocationResponse,
  ILocationsResponse,
  IStatesResponse,
  LocationsWithGroupResponse,
} from "./location.type";
import { IMessageResponse } from "../../type/common.type";
import { MESSAGES } from "../../constant/common.constant";
import CountryStateCityService from "../../service/country_state_city.service";

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
  public getFunctionalTypes = (): Promise<IFunctionalTypesResponse> => {
    return new Promise(async (resolve) => {
      const functionalTypes = await this.functionalTypeModel.getAll(
        ["id", "name"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: functionalTypes,
        statusCode: 200,
      });
    });
  };
  public create = (
    payload: ILocationRequest
  ): Promise<ILocationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
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
              }
            );
            return createdFunctionalType ? createdFunctionalType.id : "";
          }
          return function_type_id;
        })
      );
      const country = await this.countryStateCityService.getCountryDetail(
        payload.country_id
      );
      let state;
      if (payload.state_id) {
        state = await this.countryStateCityService.getStateDetail(
          payload.country_id,
          payload.state_id
        );
      }
      let cities;
      if (payload.state_id) {
        cities = await this.countryStateCityService.getCitiesByStateAndCountry(
          payload.country_id,
          payload.state_id
        );
      }
      if (!cities || cities === [])
        cities = await this.countryStateCityService.getCitiesByCountry(
          payload.country_id
        );
      const city = cities.find(
        (item) => item.id.toString() === payload.city_id
      );
      const createdLocation = await this.locationModel.create({
        ...LOCATION_NULL_ATTRIBUTES,
        business_name: payload.business_name,
        business_number: payload.business_number,
        functional_type_ids,
        country_id: payload.country_id,
        state_id: payload.state_id,
        city_id: payload.city_id,
        country_name: country?.name || "",
        state_name: state?.name || "",
        city_name: city?.name || "",
        phone_code: country.phonecode,
        address: payload.address,
        postal_code: payload.postal_code,
        general_phone: payload.general_phone,
        general_email: payload.general_email,
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
    id: string,
    payload: ILocationRequest
  ): Promise<ILocationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const location = await this.locationModel.find(id);
      if (!location) {
        return resolve({
          message: MESSAGES.NOT_FOUND_LOCATION,
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
              }
            );
            return createdFunctionalType ? createdFunctionalType.id : "";
          }
          return function_type_id;
        })
      );
      const country = await this.countryStateCityService.getCountryDetail(
        payload.country_id
      );
      let state;
      if (payload.state_id) {
        state = await this.countryStateCityService.getStateDetail(
          payload.country_id,
          payload.state_id
        );
      }
      let cities;
      if (payload.state_id) {
        cities = await this.countryStateCityService.getCitiesByStateAndCountry(
          payload.country_id,
          payload.state_id
        );
      }
      if (!cities || cities === [])
        cities = await this.countryStateCityService.getCitiesByCountry(
          payload.country_id
        );
      const city = cities.find(
        (item) => item.id.toString() === payload.city_id
      );
      const updatedLocation = await this.locationModel.update(id, {
        business_name: payload.business_name,
        business_number: payload.business_number,
        functional_type_ids,
        country_id: payload.country_id,
        state_id: payload.state_id,
        city_id: payload.city_id,
        country_name: country?.name || "",
        state_name: state?.name || "",
        city_name: city?.name || "",
        phone_code: country.phonecode,
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
          message: MESSAGES.NOT_FOUND_LOCATION,
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
      const countries = await this.countryStateCityService.getAllCountry();
      const result = await Promise.all(
        countries.map(async (country) => {
          const detail = await this.countryStateCityService.getCountryDetail(
            country.id.toString()
          );
          return {
            id: country.id.toString(),
            name: country.name,
            phone_code: detail.phonecode,
          };
        })
      );
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  public getStates = (country_id: string): Promise<IStatesResponse> =>
    new Promise(async (resolve) => {
      const states = await this.countryStateCityService.getStatesByCountry(
        country_id
      );
      const result = states.map((state) => ({
        id: state.id.toString(),
        name: state.name,
      }));
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  public getCities = (country_id: string): Promise<IStatesResponse> =>
    new Promise(async (resolve) => {
      const states = await this.countryStateCityService.getCitiesByCountry(
        country_id
      );
      const result = states.map((state) => ({
        id: state.id.toString(),
        name: state.name,
      }));
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  public getList = (
    limit: number,
    offset: number,
    filter: any,
    sort_name: string,
    sort_order: "ASC" | "DESC"
  ): Promise<ILocationsResponse> =>
    new Promise(async (resolve) => {
      const locations = await this.locationModel.list(limit, offset, filter, [
        sort_name,
        sort_order,
      ]);
      const result: ILocation[] = await Promise.all(
        locations.map(async (location: ILocationAttributes) => {
          const functionalTypes = await this.functionalTypeModel.getMany(
            location.functional_type_ids,
            ["id", "name"]
          );
          const {
            is_deleted,
            functional_type_ids,
            country_id,
            state_id,
            city_id,
            business_number,
            postal_code,
            address,
            ...rest
          } = location;
          const users = await this.userModel.getBy({
            location_id: location.id,
          });
          const teams = users?.length || 0;
          return { ...rest, functional_types: functionalTypes, teams };
        })
      );
      const pagination = await this.locationModel.getPagination(limit, offset);
      return resolve({
        data: {
          locations: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  public getListWithGroup = (): Promise<LocationsWithGroupResponse> =>
    new Promise(async (resolve) => {
      const locations = await this.locationModel.getAll(
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
          const {
            is_deleted,
            functional_type_ids,
            country_id,
            state_id,
            city_id,
            business_number,
            general_email,
            general_phone,
            ...rest
          } = location;
          return { ...rest, functional_types: functionalTypes };
        })
      );
      const distintCountries = await this.locationModel.getGroupBy(
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
}
