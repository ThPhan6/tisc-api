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
import { IMessageResponse, SystemType } from "../../type/common.type";
import { MESSAGES, SYSTEM_TYPE } from "../../constant/common.constant";
import CountryStateCityService from "../../service/country_state_city.service";
import { ICityAttributes } from "../../model/city";
import { getDistinctArray } from "../../helper/common.helper";
import ProductModel from "../../model/product.model";
import CollectionModel from "../../model/collection.model";
import MarketAvailabilityModel from "../../model/market_availability.model";

export default class LocationService {
  private locationModel: LocationModel;
  private functionalTypeModel: FunctionalTypeModel;
  private countryStateCityService: CountryStateCityService;
  private userModel: UserModel;
  private productModel: ProductModel;
  private collectionModel: CollectionModel;
  private marketAvailabilityModel: MarketAvailabilityModel;
  constructor() {
    this.locationModel = new LocationModel();
    this.functionalTypeModel = new FunctionalTypeModel();
    this.countryStateCityService = new CountryStateCityService();
    this.userModel = new UserModel();
    this.productModel = new ProductModel();
    this.collectionModel = new CollectionModel();
    this.marketAvailabilityModel = new MarketAvailabilityModel();
  }

  private getRegionName = (key: string) => {
    if (key === "africa") return "AFRICA";
    if (key === "asia") return "ASIA";
    if (key === "europe") return "EUROPE";
    if (key === "n_america") return "NORTH AMERICA";
    if (key === "oceania") return "OCEANIA";
    return "SOUTH AMERICA";
  };
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
      const country = await this.countryStateCityService.getCountryDetail(
        payload.country_id
      );
      if (!country.id) {
        return resolve({
          message: MESSAGES.COUNTRY_NOT_FOUND,
          statusCode: 404,
        });
      }
      const states = await this.countryStateCityService.getStatesByCountry(
        payload.country_id
      );
      if (states.length >= 1) {
        if (!payload.state_id || payload.state_id === "") {
          return resolve({
            message: MESSAGES.STATE_REQUIRED,
            statusCode: 400,
          });
        }
        const foundState = states.find((item) => item.id === payload.state_id);
        if (!foundState) {
          return resolve({
            message: MESSAGES.STATE_NOT_IN_COUNTRY,
            statusCode: 400,
          });
        }
        const state = await this.countryStateCityService.getStateDetail(
          payload.state_id
        );
        if (!state.id) {
          return resolve({
            message: MESSAGES.STATE_NOT_FOUND,
            statusCode: 404,
          });
        }
        const cities =
          await this.countryStateCityService.getCitiesByStateAndCountry(
            payload.country_id,
            payload.state_id
          );
        if (cities.length >= 1) {
          if (!payload.city_id || payload.city_id === "") {
            return resolve({
              message: MESSAGES.CITY_REQUIRED,
              statusCode: 400,
            });
          }
          const foundCity = cities.find((item) => item.id === payload.city_id);
          if (!foundCity) {
            return resolve({
              message: MESSAGES.CITY_NOT_IN_STATE,
              statusCode: 400,
            });
          }
        }
      }
      let functional_type_names: string[] = [];
      const functional_type_ids = await Promise.all(
        payload.functional_type_ids.map(async (functional_type_id) => {
          let functional_type = await this.functionalTypeModel.find(
            functional_type_id
          );
          if (!functional_type) {
            functional_type = await this.functionalTypeModel.findBy({
              name: functional_type_id.toLowerCase(),
            });
          }
          if (!functional_type) {
            const createdFunctionalType = await this.functionalTypeModel.create(
              {
                ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
                name: functional_type_id,
                type: user.type,
                relation_id: user.relation_id,
              }
            );
            functional_type_names.push(createdFunctionalType?.name || "");
            return createdFunctionalType ? createdFunctionalType.id : "";
          }
          functional_type_names.push(functional_type.name);
          return functional_type.id;
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
        functional_type: getDistinctArray(functional_type_names).join(", "),
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
      const country = await this.countryStateCityService.getCountryDetail(
        payload.country_id
      );
      if (!country.id) {
        return resolve({
          message: MESSAGES.COUNTRY_NOT_FOUND,
          statusCode: 404,
        });
      }
      const states = await this.countryStateCityService.getStatesByCountry(
        payload.country_id
      );
      if (states.length >= 1) {
        if (!payload.state_id || payload.state_id === "") {
          return resolve({
            message: MESSAGES.STATE_REQUIRED,
            statusCode: 400,
          });
        }
        const foundState = states.find((item) => item.id === payload.state_id);
        if (!foundState) {
          return resolve({
            message: MESSAGES.STATE_NOT_IN_COUNTRY,
            statusCode: 400,
          });
        }
        const state = await this.countryStateCityService.getStateDetail(
          payload.state_id
        );
        if (!state.id) {
          return resolve({
            message: MESSAGES.STATE_NOT_FOUND,
            statusCode: 404,
          });
        }
        const cities =
          await this.countryStateCityService.getCitiesByStateAndCountry(
            payload.country_id,
            payload.state_id
          );
        if (cities.length >= 1) {
          if (!payload.city_id || payload.city_id === "") {
            return resolve({
              message: MESSAGES.CITY_REQUIRED,
              statusCode: 400,
            });
          }
          const foundCity = cities.find((item) => item.id === payload.city_id);
          if (!foundCity) {
            return resolve({
              message: MESSAGES.CITY_NOT_IN_STATE,
              statusCode: 400,
            });
          }
        }
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
      let functional_type_names: string[] = [];
      //check functional types
      const functional_type_ids = await Promise.all(
        payload.functional_type_ids.map(async (functional_type_id) => {
          let functional_type = await this.functionalTypeModel.find(
            functional_type_id
          );
          if (!functional_type) {
            functional_type = await this.functionalTypeModel.findBy({
              name: functional_type_id.toLowerCase(),
            });
          }
          if (!functional_type) {
            const createdFunctionalType = await this.functionalTypeModel.create(
              {
                ...FUNCTIONAL_TYPE_NULL_ATTRIBUTES,
                name: functional_type_id,
                type: user.type,
                relation_id: user.relation_id,
              }
            );
            functional_type_names.push(createdFunctionalType?.name || "");
            return createdFunctionalType ? createdFunctionalType.id : "";
          }
          functional_type_names.push(functional_type.name);
          return functional_type.id;
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
        functional_type: getDistinctArray(functional_type_names).join(", "),
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
        functional_type: location.functional_type,
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
            functional_type: location.functional_type,
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
  public getBrandOrDesignLocationGroupByCountry = (
    relation_id: string,
    type: SystemType
  ): Promise<LocationsWithGroupResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const locations = await this.locationModel.getAllBy(
        { type, relation_id: relation_id },
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
        { type, relation_id: relation_id },
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
  public getMarketLocationGroupByCountry = (
    product_id: string
  ): Promise<LocationsWithGroupResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const product = await this.productModel.find(product_id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const market = await this.marketAvailabilityModel.findBy({
        collection_id: product.collection_id,
      });
      if (!market) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const countryLocations = await Promise.all(
        market.country_ids.map(async (country_id) => {
          const locations = await this.locationModel.getAllBy(
            {
              type: SYSTEM_TYPE.BRAND,
              relation_id: product.brand_id,
              country_id,
            },
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
          return {
            country_name: locations[0]?.country_name || "",
            count: locations.length,
            locations: removedFields,
          };
        })
      );
      const result = countryLocations.filter(
        (item) => item.locations && item.locations[0]
      );

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
  public getListCountryWithRegionGroup = (): Promise<any> =>
    new Promise(async (resolve) => {
      const allCountry = await this.countryStateCityService.getAllCountry();
      const data = allCountry.reduce(
        (pre: any, cur) => {
          if (cur.region.toLowerCase() === "americas") {
            if (cur.subregion.toLowerCase() === "northern america")
              return {
                ...pre,
                n_america: pre.n_america.concat([
                  {
                    id: cur.id,
                    name: cur.name,
                    phone_code: cur.phone_code,
                  },
                ]),
              };
            else
              return {
                ...pre,
                s_america: pre.s_america.concat([
                  {
                    id: cur.id,
                    name: cur.name,
                    phone_code: cur.phone_code,
                  },
                ]),
              };
          }
          if (cur.region.toLowerCase() === "asia")
            return {
              ...pre,
              asia: pre.asia.concat([
                {
                  id: cur.id,
                  name: cur.name,
                  phone_code: cur.phone_code,
                },
              ]),
            };
          if (cur.region.toLowerCase() === "africa")
            return {
              ...pre,
              africa: pre.africa.concat([
                {
                  id: cur.id,
                  name: cur.name,
                  phone_code: cur.phone_code,
                },
              ]),
            };
          if (cur.region.toLowerCase() === "oceania")
            return {
              ...pre,
              oceania: pre.oceania.concat([
                {
                  id: cur.id,
                  name: cur.name,
                  phone_code: cur.phone_code,
                },
              ]),
            };
          return {
            ...pre,
            europe: pre.europe.concat([
              {
                id: cur.id,
                name: cur.name,
                phone_code: cur.phone_code,
              },
            ]),
          };
        },
        {
          africa: [],
          asia: [],
          europe: [],
          n_america: [],
          oceania: [],
          s_america: [],
        }
      );
      const keys = Object.keys(data);
      const result = keys.map((key) => ({
        name: this.getRegionName(key),
        count: data[key].length,
        countries: data[key],
      }));
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
}
