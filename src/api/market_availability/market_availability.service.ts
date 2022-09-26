import { MESSAGES, REGION_KEY } from "../../constant/common.constant";
import MarketAvailabilityModel, {
  MARKET_AVAILABILITY_NULL_ATTRIBUTES,
} from "../../model/market_availability.model";
import { countryStateCityService } from "../../service/country_state_city.service";
import CollectionModel from "../../model/collection.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IMarketAvailabilitiesResponse,
  IMarketAvailabilityGroupByCollectionResponse,
  IMarketAvailabilityRequest,
  IMarketAvailabilityResponse,
  IUpdateMarketAvailabilityRequest,
} from "./market_availability.type";
import DistributorModel from "../../model/distributor.model";
import BrandModel from "../../model/brand.model";
import { getDistinctArray } from "../../helper/common.helper";
export default class MarketAvailabilityService {
  private marketAvailabilityModel: MarketAvailabilityModel;
  private collectionModel: CollectionModel;
  private distributorModel: DistributorModel;
  private brandModel: BrandModel;
  constructor() {
    this.marketAvailabilityModel = new MarketAvailabilityModel();
    this.collectionModel = new CollectionModel();
    this.distributorModel = new DistributorModel();
    this.brandModel = new BrandModel();
  }
  public getRegionCountries = (
    ids: string[]
  ): Promise<
    | {
        id: string;
        name: string;
        phone_code: string;
        region: string;
      }[]
  > =>
    new Promise(async (resolve) => {
      const countries = await Promise.all(
        ids.map(async (country_id) => {
          const countryDetail = await countryStateCityService.getCountryDetail(
            country_id
          );
          let region = REGION_KEY.AFRICA;
          if (countryDetail.region?.toLowerCase() === "americas") {
            if (countryDetail.subregion?.toLowerCase() === "northern america")
              region = REGION_KEY.NORTH_AMERICA;
            else region = REGION_KEY.SOUTH_AMERICA;
          }
          if (countryDetail.region?.toLowerCase() === "asia")
            region = REGION_KEY.ASIA;
          if (countryDetail.region?.toLowerCase() === "africa")
            region = REGION_KEY.AFRICA;
          if (countryDetail.region?.toLowerCase() === "oceania")
            region = REGION_KEY.OCEANIA;
          if (countryDetail.region?.toLowerCase() === "europe")
            region = REGION_KEY.EUROPE;
          return {
            id: countryDetail.id,
            name: countryDetail.name,
            phone_code: countryDetail.phone_code,
            region,
          };
        })
      );

      return resolve([
        ...new Map(countries.map((item) => [item["id"], item])).values(),
      ]);
    });
  public getBrandRegionCountries = (
    brand_id: string
  ): Promise<
    | {
        id: string;
        name: string;
        phone_code: string;
        region: string;
      }[]
  > =>
    new Promise(async (resolve) => {
      const brand = await this.brandModel.find(brand_id);
      if (!brand) {
        return resolve([]);
      }
      const distributors = await this.distributorModel.getAllBy({ brand_id }, [
        "country_id",
        "authorized_country_ids",
      ]);
      const distinctCountryIds = getDistinctArray(
        distributors.reduce((pre: any[], cur) => {
          return pre.concat([cur.country_id], cur.authorized_country_ids);
        }, [])
      );

      return resolve(await this.getRegionCountries(distinctCountryIds));
    });

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

      const createdMarket = await this.marketAvailabilityModel.create({
        ...MARKET_AVAILABILITY_NULL_ATTRIBUTES,
        collection_id: payload.collection_id,
        collection_name: collection.name,
        country_ids: payload.country_ids,
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
      const updatedMarket = await this.marketAvailabilityModel.update(
        market.id,
        payload
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
      const distributorCountries = await this.getBrandRegionCountries(
        collection.brand_id
      );
      return resolve({
        data: {
          collection_id,
          collection_name: collection.name,
          total_available: market.country_ids.length,
          total: distributorCountries.length,
          regions: region_names.map((item) => {
            const countries = distributorCountries
              .filter((country) => country.region === item)
              .map((country) => {
                return {
                  ...country,
                  id: country.id,
                  available: market.country_ids.includes(country.id),
                };
              });
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
  ): Promise<IMessageResponse | IMarketAvailabilitiesResponse> =>
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
          const countries = await this.getRegionCountries(
            market?.country_ids || []
          );
          return {
            collection_id: collection.id,
            collection_name: collection.name,
            available_countries: countries.length || 0,
            africa: countries.filter(
              (item) => item.region === REGION_KEY.AFRICA
            ).length,
            asia: countries.filter((item) => item.region === REGION_KEY.ASIA)
              .length,
            europe: countries.filter(
              (item) => item.region === REGION_KEY.EUROPE
            ).length,
            north_america: countries.filter(
              (item) => item.region === REGION_KEY.NORTH_AMERICA
            ).length,
            oceania: countries.filter(
              (item) => item.region === REGION_KEY.OCEANIA
            ).length,
            south_america: countries.filter(
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

  public getMarketAvailabilityGroupByCollection = (
    brand_id: string
  ): Promise<IMessageResponse | IMarketAvailabilityGroupByCollectionResponse> =>
    new Promise(async (resolve) => {
      const collections = await this.collectionModel.getAllBy({
        brand_id,
      });
      const marketAvailabilities = await Promise.all(
        collections.map(async (collection) => {
          const temp: any = await this.get(collection.id);
          if (temp.statusCode !== 200) {
            return {
              data: {
                collection_id: "",
                collection_name: "",
                total_available: 0,
                total: 0,
                regions: [
                  {
                    name: "",
                    count: 0,
                    countries: [
                      {
                        id: "",
                        name: "",
                        phone_code: "",
                        region: "",
                        available: false,
                      },
                    ],
                  },
                ],
              },
              statusCode: 200,
            };
          }
          return temp as IMarketAvailabilityResponse;
        })
      );
      const result = marketAvailabilities.map(
        (marketAvailability: IMarketAvailabilityResponse) => {
          let countRegion = 0;
          const regions = marketAvailability.data.regions.map((region) => {
            const availableCountries = region.countries.filter(
              (country) => country.available === true
            );
            countRegion += availableCountries.length;
            const regionCountry = availableCountries
              .map((country) => {
                return country.name;
              })
              .join(", ");
            return {
              region_name: region.name,
              count: availableCountries.length,
              region_country: regionCountry,
            };
          });
          return {
            collection_name: marketAvailability.data.collection_name,
            count: countRegion,
            regions,
          };
        }
      );
      return resolve({
        data: result.filter((item) => item.collection_name !== ""),
        statusCode: 200,
      });
    });
}
