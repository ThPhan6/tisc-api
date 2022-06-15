import LocationModel, {
  LOCATION_NULL_ATTRIBUTES,
} from "../../model/location.model";
import FunctionalTypeModel, {
  FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
} from "../../model/functional_type.model";
import {
  ICountriesResponse,
  IFunctionalTypesResponse,
  ILocationRequest,
  ILocationResponse,
  IStatesResponse,
} from "./location.type";
import { IMessageResponse } from "../../type/common.type";
import { MESSAGES } from "../../constant/common.constant";
import CountryStateCityService from "../../service/country_state_city.service";

export default class LocationService {
  private locationModel: LocationModel;
  private functionalTypeModel: FunctionalTypeModel;
  private countryStateCityService: CountryStateCityService;
  constructor() {
    this.locationModel = new LocationModel();
    this.functionalTypeModel = new FunctionalTypeModel();
    this.countryStateCityService = new CountryStateCityService();
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
  ): Promise<ILocationResponse | any> => {
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
      const createdLocation = await this.locationModel.create({
        ...LOCATION_NULL_ATTRIBUTES,
        business_name: payload.business_name,
        business_number: payload.business_number,
        functional_type_ids,
        country_id: payload.country_id,
        state_id: payload.state_id,
        city_id: payload.city_id,
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
      return this.get(createdLocation.id);
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
      const country = await this.countryStateCityService.getCountryDetail(
        location.country_id
      );
      const state = await this.countryStateCityService.getStateDetail(
        location.country_id,
        location.state_id
      );
      const cities =
        await this.countryStateCityService.getCitiesByStateAndCountry(
          location.country_id,
          location.state_id
        );
      const city = cities.find(
        (item) => item.id.toString() === location.city_id
      );
      const functionalTypes = await this.functionalTypeModel.getMany(
        location.functional_type_ids,
        ["id", "name"]
      );
      const result = {
        id: location.id,
        business_name: location.business_name,
        business_number: location.business_number,
        functional_types: functionalTypes,
        country: {
          id: country.id.toString(),
          name: country.name,
        },
        state: {
          id: state.id.toString(),
          name: state.name,
        },
        city: {
          id: city?.id.toString(),
          name: city?.name,
        },
        address: location.address,
        postal_code: location.postal_code,
        general_phone: location.general_phone,
        general_email: location.general_email,
        created_at: location.created_at,
        phone_code: country.phonecode,
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
}
