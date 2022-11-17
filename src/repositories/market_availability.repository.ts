import MarketAvailabilityModel from "@/model/market_availability.model";
import { IMarketAvailabilityAttributes } from "@/types/market_availability.type";
import BaseRepository from "./base.repository";
import moment from 'moment';
import {
  CollectionRelationType,
  SortOrder,
  ListMarketAvailability,
} from '@/types';
import {head, isFinite} from 'lodash';

class MarketAvailabilityRepository extends BaseRepository<IMarketAvailabilityAttributes> {
  protected model: MarketAvailabilityModel;
  protected DEFAULT_ATTRIBUTE: Partial<IMarketAvailabilityAttributes> = {
    collection_id: "",
    countries: [],
    created_at: "",
  };
  constructor() {
    super();
    this.model = new MarketAvailabilityModel();
  }

  private getBuilderQuery = (
    relationId: string,
    collectionId?: string,
    count: boolean = false,
    limit?: number,
    offset?: number,
    sort?: string,
    order?: SortOrder,
  ) => {
    const params: any = {
      relationId: relationId,
      relationType: CollectionRelationType.Brand,
    };
    let query = `FOR collection IN collections
        FILTER collection.deleted_at == null
        FILTER collection.relation_id == @relationId
        FILTER collection.relation_type == @relationType
    `;

    if (count) {
      query += `COLLECT WITH COUNT INTO length RETURN length`;
      return { query, params };
    }
    ////
    params.now = moment().format('YYYY-MM-DD HH:mm:ss');

    if (collectionId) {
      params.collectionId = collectionId;
    }

    if (isFinite(limit) && isFinite(offset)) {
      params.limit = limit;
      params.offset = offset;
    }
    if (sort && order) {
      params.sort = sort;
      params.order = order;
    }
    ////

    query += `${collectionId ? 'FILTER collection.id == @collectionId' : ''}
        ${isFinite(limit) && isFinite(offset) ? 'LIMIT @offset, @limit' : ''}
        ${sort && order ? 'SORT collection.@sort, @order' : ''}
    LET authorized_countries = (
        FOR distributor IN distributors
            FILTER distributor.deleted_at == null
            FILTER distributor.brand_id == @relationId
            FOR country IN countries
                FILTER country.deleted_at == null
                FILTER country.id in distributor.authorized_country_ids
        RETURN DISTINCT {
            id: country.id,
            name: country.name,
            region: country.region,
            phone_code: country.phone_code
        }
    )

    LET market_availabilities = (
        UPSERT {
            collection_id: collection.id,
            deleted_at: null
        }
        INSERT {
            id: UUID(),
            collection_id: collection.id,
            countries: [],
            created_at: @now,
            updated_at: @now,
            deleted_at: null
        }
        UPDATE {
            collection_id: collection.id,
        }
        IN market_availabilities
        RETURN NEW
    )

    RETURN MERGE({
        id: market_availabilities[0].id,
        name: collection.name,
        collection_id: collection.id,
        relation_id: collection.relation_id,
        authorized_countries: authorized_countries,
        countries: market_availabilities[0].countries,
    })`;
    return { query, params };
  }

  public async getMarketAvailabilityPagination(
    relationId: string,
    limit: number = 10,
    offset: number = 0,
    sort: string = 'created_at',
    order: SortOrder = 'DESC',
  ) {
    ///
    const queryTotal = this.getBuilderQuery(relationId, undefined, true);
    const totalResponse = await this.model.rawQueryV2(queryTotal.query, queryTotal.params);
    const totalRecords = (head(totalResponse) ?? 0) as number;
    ///
    const query = this.getBuilderQuery(relationId, undefined, false, limit, offset, sort, order);
    const data = await this.model.rawQueryV2(query.query, query.params) as ListMarketAvailability[];

    return {
      pagination: {
        page: offset / limit + 1,
        page_size: limit,
        total: totalRecords,
        page_count: Math.ceil(totalRecords / limit),
      },
      data,
    };
  }

  public async getAllCollection(relationId: string) {
    const query = this.getBuilderQuery(relationId);
    return await this.model
      .rawQueryV2(query.query, query.params) as ListMarketAvailability[];
  }

  public async findByCollection(relationId: string, collectionId: string) {
    const query = this.getBuilderQuery(relationId, collectionId);
    return (head(await this.model
      .rawQueryV2(query.query, query.params))) as ListMarketAvailability;
  }
}

export const marketAvailabilityRepository = new MarketAvailabilityRepository();
export default MarketAvailabilityRepository;
