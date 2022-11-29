import LocationModel from "@/model/location.model";
import BaseRepository from "./base.repository";
import {
  ILocationAttributes,
  LocationType,
  SortOrder,
  LocationWithTeamCountAndFunctionType,
  DesignLocationFunctionTypeOption,
} from "@/types";
import { isFinite, head } from "lodash";

class LocationRepository extends BaseRepository<ILocationAttributes> {
  protected model: LocationModel;

  constructor() {
    super();
    this.model = new LocationModel();
  }

  private getQueryWithMemberAndFunctionType = (
    relationId?: string,
    limit?: number,
    offset?: number,
    sort: string = "created_at",
    order: SortOrder = "DESC",
    isCount: boolean = false,
    id?: string,
  ) => {
    const params = {
      relationId: relationId,
      sort,
      order,
    } as any;
    if (isFinite(limit) && isFinite(offset)) {
      params.offset = offset;
      params.limit = limit;
    }
    if (id) {
      params.id = id;
    }

    //
    let rawQuery = `
      FOR location in locations
        FILTER location.deleted_at == null
        ${relationId ? 'FILTER location.relation_id == @relationId' : ''}
        ${id ? 'FILTER location.id == @id' : ''}

        ${isFinite(limit) && isFinite(offset) ? 'LIMIT @offset, @limit' : ''}
        LET userInLocationCount = FIRST(
          FOR user in users
            FILTER user.deleted_at == null
            FILTER user.location_id == location.id
          COLLECT WITH COUNT INTO length RETURN length
        )
        LET commonTypes = (
          FOR common_type in common_types
            FILTER common_type.deleted_at == null
            FILTER common_type.id in location.functional_type_ids
          RETURN {id: common_type.id, name: common_type.name}
        )
        LET designFunctionTypes = (
          FOR designFunctionType IN ${JSON.stringify(DesignLocationFunctionTypeOption)}
            FILTER designFunctionType.id in location.functional_type_ids
          RETURN designFunctionType
        )
        LET function_types = (
          FOR type in UNION(commonTypes, designFunctionTypes)
            ${sort === 'functional_type' ? 'SORT type.name @order' : 'SORT type.name ASC'}
          RETURN type
        )
        LET functional_type = CONCAT_SEPARATOR(', ', function_types[*].name)
        ${sort === 'functional_type' ? 'SORT @sort @order' : 'SORT location.@sort @order'}
    `;

    if (!isCount) {
      rawQuery += `
      RETURN MERGE(
        UNSET(location, ['_id', '_key', '_rev', 'deleted_at']),
        {
          functional_types: function_types,
          teams: userInLocationCount,
          functional_type: functional_type
        })
      `
    } else {
      rawQuery += `COLLECT WITH COUNT INTO length RETURN length`;
    }

    return {
      query: rawQuery,
      params
    }
  }

  public findWithCountMemberAndFunctionType = async (id: string) => {
    const query = this.getQueryWithMemberAndFunctionType(
      undefined, undefined, undefined, undefined, undefined, false, id
    );
    return head(await this.model.rawQueryV2(query.query, query.params)) as LocationWithTeamCountAndFunctionType;
  }

  public getLocationPagination = async (
    relationId: string,
    limit?: number,
    offset?: number,
    sort: string = "created_at",
    order: SortOrder = "DESC"
  ) => {

    const query = this.getQueryWithMemberAndFunctionType(
      relationId, limit, offset, sort, order
    );
    //
    const dataResponse = await this.model.rawQueryV2(query.query, query.params) as LocationWithTeamCountAndFunctionType[];
    let totalSize = dataResponse.length;
    if (limit && offset) {
      const totalQuery = this.getQueryWithMemberAndFunctionType(
        relationId, undefined, undefined, sort, order, true
      );
      //
      totalSize = (head(await this.model.rawQueryV2(totalQuery.query, totalQuery.params)) || 0) as number;
      return {
        pagination: {
          page: offset / limit + 1,
          page_size: limit,
          total: totalSize,
          page_count: Math.ceil(totalSize / limit),
        },
        data: dataResponse,
      };
    }
    return {
      pagination: {
        page: totalSize,
        page_size: totalSize,
        total: totalSize,
        page_count: totalSize,
      },
      data: dataResponse,
    };
  };

  public getLocationByRelationAndCountryIds = async (
    relationId: string,
    countryIds: string[]
  ) => {
    return (await this.getModel()
      .getQuery()
      .where("relation_id", "==", relationId)
      .where("country_id", "in", countryIds)
      .get()) as ILocationAttributes[];
  };

  public async getLocationDesign() {
    const params = { designLocation: LocationType.designer };
    let rawQuery = `
      FILTER locations.deleted_at == null
      FOR designer in designers
      FILTER designer.deleted_at == null
      FILTER locations.relation_id == designer.id
      FILTER locations.type == @designLocation
      RETURN locations
  `;
    return this.model.rawQuery(rawQuery, params);
  }

  public async getOriginCountry() {
    const params = { designLocation: LocationType.designer };
    let rawQuery = `
      FILTER locations.deleted_at == null
      FOR designer in designers
      FILTER designer.deleted_at == null
      FILTER locations.relation_id == designer.id
      FILTER locations.type == @designLocation
      RETURN locations.country_id
    `;
    return this.model.rawQuery(rawQuery, params);
  }

  public async getOriginLocation(relationId: string) {
    return this.model.where("relation_id", "==", relationId).first();
  }

  public getFirstHeadquarterLocation(
    relationId: string,
    headquarterId: string
  ) {
    return this.model
      .where("relation_id", "==", relationId)
      .where("functional_type_ids", "in", headquarterId, "inverse")
      .first();
  }

  public getShortLocationQuery = (key: string) =>
    `${key}.city_name == '' ? ${key}.country_name : CONCAT(${key}.city_name, ', ', ${key}.country_name)`;

  public getFullLocationQuery = (key: string) =>
    `CONCAT(${key}.address, ', ', ${key}.city_name, ${key}.city_name == '' ? '' : ', ', ${key}.state_name, ${key}.state_name == '' ? '' : ', ', ${key}.country_name, ', ', ${key}.postal_code)`;

  public basicAttributesQuery =
    "'country_id', 'state_id', 'city_id', 'country_name', 'state_name', 'city_name', 'phone_code', 'address', 'postal_code', 'business_name'";

  public async getOneWithLocation<Model>(
    modelName: string,
    modelId: string
  ): Promise<Model & ILocationAttributes> {
    const result = await this.model.rawQueryV2(
      `
          FOR ${modelName} IN ${modelName}
          FILTER ${modelName}.deleted_at == null
          FILTER ${modelName}.id == @modelId
          FOR loc IN locations
          FILTER loc.id == ${modelName}.location_id
          RETURN MERGE(
            UNSET(${modelName}, ['_id', '_key', '_rev', 'deleted_at']),
            KEEP(loc, ${this.basicAttributesQuery})
          )
        `,
      { modelId }
    );
    return result[0];
  }

  public async getListWithLocation<Model>(
    modelName: string,
    raw: string = ""
  ): Promise<Array<Model & ILocationAttributes>> {
    const rawQuery = `
      FOR ${modelName} IN ${modelName}
      FILTER ${modelName}.deleted_at == null
      FOR loc IN locations
      FILTER loc.id == ${modelName}.location_id
      ${raw}
      RETURN MERGE(
        UNSET(${modelName}, ['_id', '_key', '_rev', 'deleted_at']),
        KEEP(loc, ${this.basicAttributesQuery})
      )
    `;
    const result = await this.model.rawQueryV2(rawQuery, {});
    return result;
  }
}

export const locationRepository = new LocationRepository();
export default LocationRepository;
