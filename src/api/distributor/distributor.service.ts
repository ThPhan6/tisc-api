import { MESSAGES } from "@/constants";
import { getDistinctArray } from "@/helper/common.helper";
import BrandModel from "@/model/brand.model";
import { ICountryAttributes } from "@/model/country";
import DistributorModel, {
  DISTRIBUTOR_NULL_ATTRIBUTES,
  IDistributorAttributes,
} from "@/model/distributor.model";
import CollectionRepository from "@/repositories/collection.repository";
import MarketAvailabilityRepository from "@/repositories/market_availability.repository";
import ProductRepository from "@/repositories/product.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import { IMessageResponse, IPagination } from "@/types";
import { ICountryStateCity } from "@/types/location.type";
import {
  IDistributorGroupByCountryResponse,
  IDistributorRequest,
  IDistributorResponse,
  IDistributorsResponse,
  MarketDistributorGroupByCountry,
  MarketDistributorGroupByCountryResponse,
} from "./distributor.type";
export default class DistributorService {
  private distributorModel: DistributorModel;
  private brandModel: BrandModel;

  constructor() {
    this.distributorModel = new DistributorModel();
    this.brandModel = new BrandModel();
  }

  private updateMarkets = async (
    payload: IDistributorRequest,
    remove_country_ids?: string[],
    add_country_ids?: string[]
  ) => {
    const authorizedCountryIds = getDistinctArray(
      payload.authorized_country_ids.concat([payload.country_id])
    );
    const collections = await CollectionRepository.getAllBy({
      brand_id: payload.brand_id,
    });
    const markets = await Promise.all(
      collections.map(async (collection) => {
        return await MarketAvailabilityRepository.findBy({
          collection_id: collection.id,
        });
      })
    );
    await Promise.all(
      markets.map(async (market) => {
        let newCountryIds: string[] = getDistinctArray(
          market?.country_ids.concat(authorizedCountryIds) || []
        );
        if (remove_country_ids || add_country_ids) {
          newCountryIds =
            market?.country_ids
              .filter((item) => !remove_country_ids?.includes(item))
              .concat(add_country_ids || []) || [];
        }
        await MarketAvailabilityRepository.update(market?.id || "", {
          country_ids: getDistinctArray(newCountryIds),
        });
        return true;
      })
    );
  };
  public create = (
    payload: IDistributorRequest
  ): Promise<IMessageResponse | IDistributorResponse> => {
    return new Promise(async (resolve) => {
      const distributor = await this.distributorModel.findBy({
        name: payload.name,
        brand_id: payload.brand_id,
      });
      if (distributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_EXISTED,
          statusCode: 400,
        });
      }

      const brand = await this.brandModel.find(payload.brand_id);
      if (!brand) {
        return resolve({
          message: MESSAGES.BRAND_NOT_FOUND,
          statusCode: 404,
        });
      }
      const country = await countryStateCityService.getCountryDetail(
        payload.country_id
      );
      if (!country.id) {
        return resolve({
          message: MESSAGES.COUNTRY_NOT_FOUND,
          statusCode: 404,
        });
      }
      const states = await countryStateCityService.getStatesByCountry(
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
        const state = await countryStateCityService.getStateDetail(
          payload.state_id
        );
        if (!state.id) {
          return resolve({
            message: MESSAGES.STATE_NOT_FOUND,
            statusCode: 404,
          });
        }
        const cities = await countryStateCityService.getCitiesByStateAndCountry(
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
      const countryStateCity =
        await countryStateCityService.getCountryStateCity(
          payload.country_id,
          payload.city_id,
          payload.state_id
        );
      if (!countryStateCity) {
        return resolve({
          message: MESSAGES.COUNTRY_STATE_CITY_NOT_FOUND,
          statusCode: 400,
        });
      }
      const authorizedCountries = await countryStateCityService.getCountries(
        payload.authorized_country_ids
      );
      if (!authorizedCountries) {
        return resolve({
          message: "Not authorized countries, please check ids",
          statusCode: 400,
        });
      }
      const authorizedCountriesName = authorizedCountries.reduce(
        (pre, cur, index) => {
          if (index === 0) {
            return pre + cur.name;
          }
          return pre + ", " + cur.name;
        },
        ""
      );
      const createdDistributor = await this.distributorModel.create({
        ...DISTRIBUTOR_NULL_ATTRIBUTES,
        brand_id: payload.brand_id,
        name: payload.name,
        country_name: countryStateCity.country_name,
        country_id: countryStateCity.country_id,
        state_id: countryStateCity.state_id,
        state_name: countryStateCity.state_name,
        city_name: countryStateCity.city_name,
        city_id: countryStateCity.city_id,
        address: payload.address,
        phone_code: countryStateCity.phone_code,
        postal_code: payload.postal_code,
        first_name: payload.first_name,
        last_name: payload.last_name,
        gender: payload.gender,
        email: payload.email,
        phone: payload.phone,
        mobile: payload.mobile,
        authorized_country_ids: payload.authorized_country_ids,
        authorized_country_name: authorizedCountriesName,
        coverage_beyond: payload.coverage_beyond,
      });

      if (!createdDistributor) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      await this.updateMarkets(payload);
      return resolve(await this.getOne(createdDistributor.id));
    });
  };

  public getOne = (
    id: string
  ): Promise<IMessageResponse | IDistributorResponse> => {
    return new Promise(async (resolve) => {
      const distributor = await this.distributorModel.find(id);
      if (!distributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_NOT_FOUND,
          statusCode: 404,
        });
      }

      const authorizedCountries = await countryStateCityService.getCountries(
        distributor.authorized_country_ids
      );
      if (!authorizedCountries) {
        return resolve({
          message: "Not authorized countries, please check ids",
          statusCode: 400,
        });
      }
      const authorizedCountriesName = authorizedCountries.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      const { is_deleted, ...rest } = distributor;
      const result = {
        ...rest,
        authorized_countries: authorizedCountriesName,
      };
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };

  public update = (
    id: string,
    payload: IDistributorRequest
  ): Promise<IMessageResponse | IDistributorResponse | any> => {
    return new Promise(async (resolve) => {
      const distributor = await this.distributorModel.find(id);
      if (!distributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_NOT_FOUND,
          statusCode: 400,
        });
      }

      const brand = await this.brandModel.find(payload.brand_id);
      if (!brand) {
        return resolve({
          message: MESSAGES.BRAND_NOT_FOUND,
          statusCode: 404,
        });
      }
      const existedDistributor =
        await this.distributorModel.getExistedBrandDistributor(
          id,
          payload.brand_id,
          payload.name
        );
      if (existedDistributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_EXISTED,
          statusCode: 400,
        });
      }
      const country = await countryStateCityService.getCountryDetail(
        payload.country_id
      );
      if (!country.id) {
        return resolve({
          message: MESSAGES.COUNTRY_NOT_FOUND,
          statusCode: 404,
        });
      }
      const states = await countryStateCityService.getStatesByCountry(
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
        const state = await countryStateCityService.getStateDetail(
          payload.state_id
        );
        if (!state.id) {
          return resolve({
            message: MESSAGES.STATE_NOT_FOUND,
            statusCode: 404,
          });
        }
        const cities = await countryStateCityService.getCitiesByStateAndCountry(
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
      let newPayload: any = payload;
      let countryStateCity: ICountryStateCity | false = false;
      if (
        payload.country_id !== distributor.country_id ||
        payload.state_id !== distributor.state_id ||
        payload.city_id !== distributor.city_id
      ) {
        countryStateCity = await countryStateCityService.getCountryStateCity(
          payload.country_id,
          payload.city_id,
          payload.state_id
        );
        if (!countryStateCity) {
          return resolve({
            message: MESSAGES.COUNTRY_STATE_CITY_NOT_FOUND,
            statusCode: 400,
          });
        }
        newPayload = {
          ...newPayload,
          country_name: countryStateCity.country_name,
          country_id: countryStateCity.country_id,
          state_id: countryStateCity.state_id,
          state_name: countryStateCity.state_name,
          city_name: countryStateCity.city_name,
          city_id: countryStateCity.city_id,
          phone_code: countryStateCity.phone_code,
        };
      }
      let authorizedCountries: ICountryAttributes[] | false = false;
      let authorizedCountriesName = "";
      if (
        payload.authorized_country_ids.toString() !==
        distributor.authorized_country_ids.toString()
      ) {
        authorizedCountries = await countryStateCityService.getCountries(
          payload.authorized_country_ids
        );
        if (!authorizedCountries) {
          return resolve({
            message: "Not authorized countries, please check ids",
            statusCode: 400,
          });
        }
        authorizedCountriesName = authorizedCountries.reduce(
          (pre, cur, index) => {
            if (index === 0) {
              return pre + cur.name;
            }
            return pre + ", " + cur.name;
          },
          ""
        );
        newPayload = {
          ...newPayload,
          authorized_country_ids: payload.authorized_country_ids,
          authorized_country_name: authorizedCountriesName,
        };
      }
      const updatedDistributor = await this.distributorModel.update(
        id,
        newPayload
      );

      if (!updatedDistributor) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      if (
        payload.country_id !== distributor.country_id ||
        payload.authorized_country_ids.sort().toString() !==
          distributor.authorized_country_ids.sort().toString()
      ) {
        const oldCountryIds = getDistinctArray(
          distributor.authorized_country_ids.concat([distributor.country_id])
        );
        const newCountryIds = getDistinctArray(
          payload.authorized_country_ids.concat([payload.country_id])
        );
        const removeCountryIds = oldCountryIds.filter(
          (item) => !newCountryIds.includes(item)
        );
        const addCountryIds = newCountryIds.filter(
          (item) => !oldCountryIds.includes(item)
        );
        await this.updateMarkets(payload, removeCountryIds, addCountryIds);
      }
      return resolve(await this.getOne(updatedDistributor.id));
    });
  };

  public delete = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const foundDistributor = await this.distributorModel.findBy(id);
      if (!foundDistributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_NOT_FOUND,
          statusCode: 404,
        });
      }

      const updatedDistributor = await this.distributorModel.update(id, {
        is_deleted: true,
      });
      if (!updatedDistributor) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };

  public getList = (
    brand_id: string,
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: "ASC" | "DESC"
  ): Promise<IMessageResponse | IDistributorsResponse> => {
    return new Promise(async (resolve) => {
      const distributors = await this.distributorModel.list(
        limit,
        offset,
        {
          ...filter,
          brand_id,
        },
        [sort, order]
      );
      const pagination: IPagination = await this.distributorModel.getPagination(
        limit,
        offset,
        { brand_id }
      );
      const result = distributors.map((distributor: IDistributorAttributes) => {
        return {
          id: distributor.id,
          name: distributor.name,
          country_name: distributor.country_name,
          city_name: distributor.city_name,
          first_name: distributor.first_name,
          last_name: distributor.last_name,
          email: distributor.email,
          authorized_country_name: distributor.authorized_country_name,
          coverage_beyond: distributor.coverage_beyond,
          created_at: distributor.created_at,
        };
      });
      return resolve({
        data: {
          distributors: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  };

  public getDistributorGroupByCountry = async (
    brand_id: string
  ): Promise<IMessageResponse | IDistributorGroupByCountryResponse> => {
    return new Promise(async (resolve) => {
      const brand = await this.brandModel.find(brand_id);
      if (!brand) {
        return resolve({
          message: MESSAGES.BRAND_NOT_FOUND,
          statusCode: 404,
        });
      }
      const distributors = await this.distributorModel.getAllBy({ brand_id });
      const countryIds = getDistinctArray(
        distributors.map((distributor) => distributor.country_id)
      );
      const countries = await Promise.all(
        countryIds.map(async (countryId) => {
          return await countryStateCityService.getCountryDetail(countryId);
        })
      );
      const result = countries
        .map((country) => {
          const groupDistributors = distributors.filter(
            (item) => item.country_id === country.id
          );
          const removedFieldsOfDistributor = groupDistributors.map(
            (distributor) => {
              return {
                name: distributor.name,
                address: distributor.address,
                person: distributor.first_name + " " + distributor.last_name,
                gender: distributor.gender,
                email: distributor.email,
                phone: distributor.phone,
                mobile: distributor.mobile,
                authorized_country_name: distributor.authorized_country_name,
                coverage_beyond: distributor.coverage_beyond,
              };
            }
          );
          return {
            country_name: country.name,
            count: groupDistributors.length,
            distributors: removedFieldsOfDistributor,
          };
        })
        .flat();
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };

  public getMarketDistributorGroupByCountry = async (
    product_id: string
  ): Promise<IMessageResponse | MarketDistributorGroupByCountryResponse> => {
    return new Promise(async (resolve) => {
      const product = await ProductRepository.find(product_id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const market = await MarketAvailabilityRepository.findBy({
        collection_id: product.collection_id,
      });
      if (!market) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }

      const distributors = await this.distributorModel.getMarketDistributor(
        product.brand_id,
        market.country_ids
      );
      const result: MarketDistributorGroupByCountry[] = [];
      distributors.forEach((distributor) => {
        const groupIndex = result.findIndex(
          (country) => country.country_name === distributor.country_name
        );
        if (groupIndex === -1) {
          result.push({
            country_name: distributor.country_name,
            count: 1,
            distributors: [distributor],
          });
        } else {
          result[groupIndex] = {
            ...result[groupIndex],
            count: result[groupIndex].count + 1,
            distributors: [...result[groupIndex].distributors, distributor],
          };
        }
      });
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
}
