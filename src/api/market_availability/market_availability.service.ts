import { MESSAGES, Region } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import {getEnumKeys} from '@/helper/common.helper';

import {
  SortOrder,
  UserAttributes,
  UserType,
  RegionKey
} from "@/types";
import {
  mappingGroupByCollection,
  mappingMarketAvailibility,
} from "./market_availability.mapping";
import {
  IUpdateMarketAvailabilityRequest,
} from "./market_availability.type";
import { marketAvailabilityRepository } from "@/repositories/market_availability.repository";

class MarketAvailabilityService {

  public async update(
    user: UserAttributes,
    collectionId: string,
    payload: IUpdateMarketAvailabilityRequest
  ) {
    const market = await marketAvailabilityRepository.findByCollection(
      user.relation_id,
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

    return this.get(user, collectionId);
  }

  public async get(user: UserAttributes, collectionId: string) {
    const market = await marketAvailabilityRepository.findByCollection(user.relation_id, collectionId);
    //
    if (!market) {
      return errorMessageResponse(MESSAGES.MARKET_AVAILABILITY_NOT_FOUND, 404);
    }
    //
    const result = mappingMarketAvailibility(market, false);
    return successResponse({
        data: {
          collection_id: result.collection_id,
          collection_name: result.name,
          regions: getEnumKeys(Region).map((region: any) => {
            const regionName = region as RegionKey;
            return {
              count: result[regionName].length,
              name: Region[regionName],
              countries: result[regionName]
            }
          }),
          total: result.countries.length,
          total_available: result.available_countries
        }
    });
  }

  public async getList(
    user: UserAttributes,
    brandId: string,
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder
  ) {
    //
    if (user.type !== UserType.TISC && user.relation_id !== brandId) {
      return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_ACCESS);
    }
    //
    const marketAvailabilities = await marketAvailabilityRepository.getMarketAvailabilityPagination(
      brandId, limit, offset,
      sort, order
    );
    //
    const collections = marketAvailabilities.data.map(
      (market) => mappingMarketAvailibility(market)
    );
    return successResponse({
      data: {
        collections,
        pagination: marketAvailabilities.pagination,
      },
    });
  }

  public async getMarketAvailabilityGroupByCollection(relationId: string) {
    const collections = await marketAvailabilityRepository.getAllCollection(relationId);
    return successResponse({
      data: mappingGroupByCollection(collections),
    });
  }
}

export const marketAvailabilityService = new MarketAvailabilityService();
export default MarketAvailabilityService;
