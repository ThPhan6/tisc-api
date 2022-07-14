import { IDistributorAttributes } from "./../../model/distributor.model";
import { MESSAGES } from "./../../constant/common.constant";
import DistributorModel, {
  DISTRIBUTOR_NULL_ATTRIBUTES,
} from "../../model/distributor.model";
import { IMessageResponse, IPagination } from "./../../type/common.type";
import {
  IDistributorRequest,
  IDistributorResponse,
  IDistributorsResponse,
} from "./distributor.type";
import CountryStateCityService, {
  ICountryStateCity,
} from "../../service/country_state_city.service";
import BrandModel from "../../model/brand.model";
import MarketAvailabilityModel from "../../model/market_availability.model";
import CollectionModel from "../../model/collection.model";
import { getDistinctArray } from "../../helper/common.helper";
import { ICountryAttributes } from "../../model/country";
export default class DistributorService {
  private distributorModel: DistributorModel;
  private countryStateCityService: CountryStateCityService;
  private brandModel: BrandModel;
  private marketAvailabilityModel: MarketAvailabilityModel;
  private collectionModel: CollectionModel;
  constructor() {
    this.distributorModel = new DistributorModel();
    this.countryStateCityService = new CountryStateCityService();
    this.brandModel = new BrandModel();
    this.marketAvailabilityModel = new MarketAvailabilityModel();
    this.collectionModel = new CollectionModel();
  }

  private updateMarkets = async (payload: IDistributorRequest) => {
    const authorizedCountryIds = getDistinctArray(
      payload.authorized_country_ids.concat([payload.country_id])
    );
    const collections = await this.collectionModel.getAllBy({
      brand_id: payload.brand_id,
    });
    const markets = await Promise.all(
      collections.map(async (collection) => {
        return await this.marketAvailabilityModel.findBy({
          collection_id: collection.id,
        });
      })
    );
    const newMarkets = markets.filter((item) => item);
    await Promise.all(
      newMarkets.map(async (market) => {
        const newCountryIds = getDistinctArray(
          market?.country_ids.concat(authorizedCountryIds) || []
        );
        const updated = await this.marketAvailabilityModel.update(
          market?.id || "",
          {
            country_ids: newCountryIds,
          }
        );
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
      const countryStateCity =
        await this.countryStateCityService.getCountryStateCity(
          payload.country_id,
          payload.city_id,
          payload.state_id
        );
      if (countryStateCity === false) {
        return resolve({
          message: "Not found location, please check country state city id",
          statusCode: 400,
        });
      }
      const authorizedCountries =
        await this.countryStateCityService.getCountries(
          payload.authorized_country_ids
        );
      if (authorizedCountries === false) {
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

      const authorizedCountries =
        await this.countryStateCityService.getCountries(
          distributor.authorized_country_ids
        );
      if (authorizedCountries === false) {
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
      let newPayload: any = payload;
      let countryStateCity: ICountryStateCity | false = false;
      if (
        payload.country_id !== distributor.country_id ||
        payload.state_id !== distributor.state_id ||
        payload.city_id !== distributor.city_id
      ) {
        countryStateCity =
          await this.countryStateCityService.getCountryStateCity(
            payload.country_id,
            payload.city_id,
            payload.state_id
          );
        if (countryStateCity === false) {
          return resolve({
            message: "Not found location, please check country state city id",
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
        authorizedCountries = await this.countryStateCityService.getCountries(
          payload.authorized_country_ids
        );
        if (authorizedCountries === false) {
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
        await this.updateMarkets(payload);
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
}
