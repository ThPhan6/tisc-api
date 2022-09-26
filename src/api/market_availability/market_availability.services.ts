import { distributorRepository } from "@/repositories/distributor.repository";
import { marketAvailabilityRepository } from "./../../repositories/market_availability.repository";
import { MESSAGES } from "@/constants";
import { getDistinctArray } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import BrandModel from "@/model/brand.model";
import CollectionRepository from "@/repositories/collection.repository";
import CountryStateCityService from "@/service/country_state_city.service";
import { IRegionCountry } from "@/types";
import {
  mappingGroupByCollection,
  mappingRegionCountries,
  mappingResponseGetMarket,
  mappingResponseListMarket,
} from "./market_availability.mapping";
import {
  IMarketAvailabilityRequest,
  IMarketAvailabilityResponse,
  IUpdateMarketAvailabilityRequest,
} from "./market_availability.type";

class MarketAvailabilityService {
  private countryStateCityService: CountryStateCityService;
  private brandModel: BrandModel;
  constructor() {
    this.countryStateCityService = new CountryStateCityService();
    this.brandModel = new BrandModel();
  }

  public async getRegionCountries(ids: string[]) {
    const countries = await Promise.all(
      ids.map(async (country_id) => {
        const countryDetail =
          await this.countryStateCityService.getCountryDetail(country_id);
        return mappingRegionCountries(countryDetail);
      })
    );

    return [
      ...new Map(countries.map((item) => [item["id"], item])).values(),
    ] as IRegionCountry[];
  }

  public async getBrandRegionCountries(brand_id: string) {
    const brand = await this.brandModel.find(brand_id);

    if (!brand) {
      return [];
    }

    const distributors = await distributorRepository.getAllBy({ brand_id });

    const distinctCountryIds = getDistinctArray(
      distributors.reduce((pre: any[], cur) => {
        return pre.concat([cur.country_id], cur.authorized_country_ids);
      }, [])
    );

    return await this.getRegionCountries(distinctCountryIds);
  }

  public async create(payload: IMarketAvailabilityRequest) {
    const collection = await CollectionRepository.find(payload.collection_id);

    if (!collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND, 404);
    }

    const market =
      await marketAvailabilityRepository.findMarketAvailabilityByCollection(
        payload.collection_id
      );

    if (market) {
      return errorMessageResponse(
        MESSAGES.MARKET_AVAILABILITY.MARKET_AVAILABILITY_EXISTED
      );
    }

    const createdMarket = await marketAvailabilityRepository.create({
      collection_id: payload.collection_id,
      collection_name: collection.name,
      country_ids: payload.country_ids,
    });

    if (!createdMarket) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    return successResponse({
      data: createdMarket,
    });
  }

  public async update(
    collectionId: string,
    payload: IUpdateMarketAvailabilityRequest
  ) {
    const collection = await CollectionRepository.find(collectionId);

    if (!collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND, 404);
    }

    const market =
      await marketAvailabilityRepository.findMarketAvailabilityByCollection(
        collectionId
      );

    if (!market) {
      return errorMessageResponse(
        MESSAGES.MARKET_AVAILABILITY.MARKET_AVAILABILITY_NOT_FOUND,
        404
      );
    }

    const updatedMarket = await marketAvailabilityRepository.update(
      market.id,
      payload
    );

    if (!updatedMarket) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    const distributorCountries = await this.getBrandRegionCountries(
      collection.brand_id
    );
    return successResponse({
      data: mappingResponseGetMarket(
        collection.id,
        collection.name,
        distributorCountries,
        market
      ),
    });
  }

  public async get(collectionId: string) {
    const collection = await CollectionRepository.find(collectionId);

    if (!collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND, 404);
    }

    const market =
      await marketAvailabilityRepository.findMarketAvailabilityByCollection(
        collectionId
      );

    if (!market) {
      return errorMessageResponse(
        MESSAGES.MARKET_AVAILABILITY.MARKET_AVAILABILITY_NOT_FOUND,
        404
      );
    }

    const distributorCountries = await this.getBrandRegionCountries(
      collection.brand_id
    );

    return successResponse({
      data: mappingResponseGetMarket(
        collection.id,
        collection.name,
        distributorCountries,
        market
      ),
    });
  }

  public async getList(
    brandId: string,
    limit: number,
    offset: number,
    filter: any,
    sort: any
  ) {
    const collections =
      await CollectionRepository.getListCollectionWithPaginate(
        limit,
        offset,
        brandId,
        sort
      );

    const result = await Promise.all(
      collections.data.map(async (collection: any) => {
        const market = await marketAvailabilityRepository.findBy({
          collection_id: collection.id,
        });
        const countries = await this.getRegionCountries(
          market?.country_ids || []
        );
        return mappingResponseListMarket(collection, countries);
      })
    );

    return successResponse({
      data: {
        collections: result,
        pagination: collections.pagination,
      },
    });
  }

  public async getMarketAvailabilityGroupByCollection(brandId: string) {
    const collections = await CollectionRepository.getByBrand(brandId);

    const marketAvailabilities = await Promise.all(
      collections.map(async (collection) => {
        return (await this.get(collection.id)) as IMarketAvailabilityResponse;
      })
    );

    const result = mappingGroupByCollection(marketAvailabilities);

    return successResponse({
      data: result.filter((item) => item.collection_name !== ""),
    });
  }
}

export default new MarketAvailabilityService();
