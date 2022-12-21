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

  private upsertMarketAvailabilityQuery = (collectionId: string) => {
    return `
      UPSERT {
          collection_id: ${collectionId},
          deleted_at: null
      }
      INSERT {
          id: UUID(),
          collection_id: ${collectionId},
          countries: [],
          created_at: DATE_FORMAT(DATE_NOW(), "%yyyy-%mm-%dd %hh:%ii:%ss"),
          updated_at: DATE_FORMAT(DATE_NOW(), "%yyyy-%mm-%dd %hh:%ii:%ss"),
          deleted_at: null
      }
      UPDATE {
          collection_id: ${collectionId},
      }
      IN market_availabilities OPTIONS { ignoreErrors: true, waitForSync: true }
    `
  }
  public upsertMarketAvailability = async (collectionId: string) => {
    const params = { collectionId };
    const query = this.upsertMarketAvailabilityQuery('@collectionId');
    return this.model.rawQueryV2(query, params);
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
        ${sort && order ? 'SORT collection.@sort @order' : ''}
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

    LET market_availability = FIRST(
      FOR availability IN market_availabilities
        FILTER availability.collection_id == collection.id
        FILTER availability.deleted_at == null
        LET countries = (
            FOR authorized_country IN authorized_countries
            LET c = FIRST(availability.countries[* FILTER CURRENT.id == authorized_country.id])
            RETURN {
                id: authorized_country.id,
                name: authorized_country.name,
                region: authorized_country.region,
                phone_code: authorized_country.phone_code,
                available: c ? c.available : true
            }
        )
        RETURN MERGE(availability, {
            countries: countries
        })
    )

    RETURN MERGE({
        id: market_availability.id,
        name: collection.name,
        collection_id: collection.id,
        relation_id: collection.relation_id,
        countries: market_availability.countries,
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
