import { MESSAGES, REGION_KEY } from "../../constant/common.constant";
import MarketAvailabilityModel, {
  MARKET_AVAILABILITY_NULL_ATTRIBUTES,
} from "../../model/market_availability.model";
import CountryStateCityService from "../../service/country_state_city.service";
import CollectionModel from "../../model/collection.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IMarketAvailabilityRequest,
  IMarketAvailabilityResponse,
  IUpdateMarketAvailabilityRequest,
} from "./market_availability.type";
export default class Service {
  private marketAvailabilityModel: MarketAvailabilityModel;
  private countryStateCityService: CountryStateCityService;
  private collectionModel: CollectionModel;
  constructor() {
    this.marketAvailabilityModel = new MarketAvailabilityModel();
    this.countryStateCityService = new CountryStateCityService();
    this.collectionModel = new CollectionModel();
  }

  public create = (
    payload: IMarketAvailabilityRequest
  ): Promise<IMessageResponse | IMarketAvailabilityResponse> =>
    new Promise(async (resolve) => {
      const collection = await this.collectionModel.find(payload.collection_id);
      if (!collection) {
        return resolve({
          message: MESSAGES.COLLECTION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const market = await this.marketAvailabilityModel.findBy({
        collection_id: payload.collection_id,
      });
      if (market) {
        return resolve({
          message: MESSAGES.MARKET_AVAILABILITY_EXISTED,
          statusCode: 400,
        });
      }
      const distributors = [{ country_id: "vn" }, { country_id: "us" }];
      const countries = await Promise.all(
        distributors
          .filter((item) => payload.country_ids.includes(item.country_id))
          .map(async (item) => {
            const countryDetail =
              await this.countryStateCityService.getCountryDetail(
                item.country_id
              );
            let region = REGION_KEY.AFRICA;
            if (countryDetail.region.toLowerCase() === "americas") {
              if (countryDetail.subregion.toLowerCase() === "northern america")
                region = REGION_KEY.NORTH_AMERICA;
              else region = REGION_KEY.SOUTH_AMERICA;
            }
            if (countryDetail.region.toLowerCase() === "asia")
              region = REGION_KEY.ASIA;
            if (countryDetail.region.toLowerCase() === "oceania")
              region = REGION_KEY.OCEANIA;
            if (countryDetail.region.toLowerCase() === "europe")
              region = REGION_KEY.EUROPE;
            return {
              id: item.country_id,
              name: countryDetail.name,
              phone_code: countryDetail.country_id,
              region,
            };
          })
      );
      const createdMarket = await this.marketAvailabilityModel.create({
        ...MARKET_AVAILABILITY_NULL_ATTRIBUTES,
        collection_id: payload.collection_id,
        collection_name: collection.name,
        countries,
      });
      if (!createdMarket) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(payload.collection_id));
    });
  public update = (
    collection_id: string,
    payload: IUpdateMarketAvailabilityRequest
  ): Promise<IMessageResponse | IMarketAvailabilityResponse> =>
    new Promise(async (resolve) => {
      const collection = await this.collectionModel.find(collection_id);
      if (!collection) {
        return resolve({
          message: MESSAGES.COLLECTION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const market = await this.marketAvailabilityModel.findBy({
        collection_id: collection_id,
      });
      if (!market) {
        return resolve({
          message: MESSAGES.MARKET_AVAILABILITY_NOT_FOUND,
          statusCode: 404,
        });
      }
      const distributors = [{ country_id: "vn" }, { country_id: "us" }];
      const countries = await Promise.all(
        distributors
          .filter((item) => payload.country_ids.includes(item.country_id))
          .map(async (item) => {
            const countryDetail =
              await this.countryStateCityService.getCountryDetail(
                item.country_id
              );
            let region = REGION_KEY.AFRICA;
            if (countryDetail.region.toLowerCase() === "americas") {
              if (countryDetail.subregion.toLowerCase() === "northern america")
                region = REGION_KEY.NORTH_AMERICA;
              else region = REGION_KEY.SOUTH_AMERICA;
            }
            if (countryDetail.region.toLowerCase() === "asia")
              region = REGION_KEY.ASIA;
            if (countryDetail.region.toLowerCase() === "oceania")
              region = REGION_KEY.OCEANIA;
            if (countryDetail.region.toLowerCase() === "europe")
              region = REGION_KEY.EUROPE;
            return {
              id: item.country_id,
              name: countryDetail.name,
              phone_code: countryDetail.country_id,
              region,
            };
          })
      );
      const updatedMarket = await this.marketAvailabilityModel.update(
        market.id,
        {
          countries,
        }
      );
      if (!updatedMarket) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(collection_id));
    });
  public get = (
    collection_id: string
  ): Promise<IMessageResponse | IMarketAvailabilityResponse> =>
    new Promise(async (resolve) => {
      const collection = await this.collectionModel.find(collection_id);
      if (!collection) {
        return resolve({
          message: MESSAGES.COLLECTION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const market = await this.marketAvailabilityModel.findBy({
        collection_id,
      });
      if (!market) {
        return resolve({
          message: MESSAGES.MARKET_AVAILABILITY_NOT_FOUND,
          statusCode: 404,
        });
      }
      const region_names = Object.values(REGION_KEY);
      return resolve({
        data: {
          collection_id,
          collection_name: collection.name,
          total: market.countries.length,
          regions: region_names.map((item) => {
            const countries = market.countries.filter(
              (country) => country.region === item
            );
            return {
              name: item,
              count: countries.length,
              countries,
            };
          }),
        },
        statusCode: 200,
      });
    });
  public getList = (
    brand_id: string,
    limit: number,
    offset: number,
    filter: any,
    sort: any
  ): Promise<IMessageResponse | IMarketAvailabilityResponse> =>
    new Promise(async (resolve) => {
      const collections = await this.collectionModel.list(
        limit,
        offset,
        { ...filter, brand_id },
        sort
      );
      const pagination: IPagination = await this.collectionModel.getPagination(
        limit,
        offset,
        { brand_id }
      );
      const result = await Promise.all(
        collections.map(async (collection: any) => {
          const market = await this.marketAvailabilityModel.findBy({
            collection_id: collection.id,
          });
          return {
            collection_id: collection.id,
            collection_name: collection.name,
            available_countries: market?.countries.length || 0,
            africa: market?.countries.filter(
              (item) => item.region === REGION_KEY.AFRICA
            ).length,
            asia: market?.countries.filter(
              (item) => item.region === REGION_KEY.ASIA
            ).length,
            europe: market?.countries.filter(
              (item) => item.region === REGION_KEY.EUROPE
            ).length,
            north_america: market?.countries.filter(
              (item) => item.region === REGION_KEY.NORTH_AMERICA
            ).length,
            oceania: market?.countries.filter(
              (item) => item.region === REGION_KEY.OCEANIA
            ).length,
            south_america: market?.countries.filter(
              (item) => item.region === REGION_KEY.SOUTH_AMERICA
            ).length,
          };
        })
      );
      return resolve({
        data: {
          collections: result,
          pagination,
        },
        statusCode: 200,
      });
    });
}
