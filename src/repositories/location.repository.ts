import LocationModel from "@/models/location.model";
import BaseRepository from "./base.repository";
import {
  ILocationAttributes,
  UserType,
  SortOrder,
  LocationWithTeamCountAndFunctionType,
  DesignLocationFunctionTypeOption,
  UserStatus,
} from "@/types";
import _, { isFinite, head } from "lodash";
import { COMMON_TYPES } from "@/constants";
import { pagination } from "@/helpers/common.helper";

class LocationRepository extends BaseRepository<ILocationAttributes> {
  protected model: LocationModel;

  constructor() {
    super();
    this.model = new LocationModel();
  }

  private getQueryWithMemberAndFunctionType = (options: {
    relationId?: string | null;
    limit?: number;
    offset?: number;
    sort?: string;
    order?: SortOrder;
    isCount?: boolean;
    id?: string;
  }) => {
    const {
      relationId,
      isCount = false,
      order = "DESC",
      sort = "created_at",
      id,
      limit,
      offset,
    } = options;

    let params = {
      relationId: relationId,
      order,
      activeStatus: UserStatus.Active,
      id,
    } as any;
    if (sort !== "functional_type") {
      params.sort = sort;
    }
    if (isFinite(limit) && isFinite(offset)) {
      params.offset = offset;
      params.limit = limit;
    }

    //
    let rawQuery = `
      FOR location in locations
        FILTER location.deleted_at == null
        ${relationId ? "FILTER location.relation_id == @relationId" : ""}
        ${id ? "FILTER location.id == @id" : ""}

        LET userInLocationCount = FIRST(
          FOR user in users
            FILTER user.deleted_at == null
            FILTER user.location_id == location.id
            FILTER user.status == @activeStatus
          COLLECT WITH COUNT INTO length RETURN length
        )
        LET contacts = @relationId ? (
          FOR user in users
            FILTER user.deleted_at == null
            FILTER user.relation_id == @relationId
            FILTER user.location_id == location.id
            FILTER user.status == @activeStatus
          FOR common_type in common_types
            FILTER common_type.deleted_at == null
            FILTER common_type.id == user.department_id
            FILTER common_type.type == ${COMMON_TYPES.DEPARTMENT}
            FILTER TRIM(common_type.name) IN
              ['Client/Customer Service', 'Marketing & Sales', 'Operation & Project Management']
          RETURN {
            department: common_type.name,
            first_name: user.firstname,
            last_name: user.lastname,
            position: user.position,
            work_email: user.email,
            work_phone: user.phone,
            work_mobile: user.mobile,
            phone_code: user.phone_code,
          }
        ) : []
        LET commonTypes = (
          FOR common_type in common_types
            FILTER common_type.deleted_at == null
            FILTER common_type.id in location.functional_type_ids
          RETURN {id: common_type.id, name: common_type.name}
        )
        LET designFunctionTypes = (
          FOR designFunctionType IN ${JSON.stringify(
            DesignLocationFunctionTypeOption
          )}
            FILTER designFunctionType.id in location.functional_type_ids
          RETURN designFunctionType
        )
        LET function_types = (
          FOR type in UNION(commonTypes, designFunctionTypes)
            ${
              sort === "functional_type"
                ? "SORT type.name @order"
                : "SORT type.name ASC"
            }
          RETURN type
        )
        LET functional_type = CONCAT_SEPARATOR(', ', function_types[*].name)
        ${
          sort === "functional_type"
            ? "SORT functional_type @order"
            : "SORT location.@sort @order"
        }
        ${isFinite(limit) && isFinite(offset) ? "LIMIT @offset, @limit" : ""}
    `;

    if (!isCount) {
      rawQuery += `
      RETURN MERGE(
        UNSET(location, ['_id', '_key', '_rev', 'deleted_at']),
        {
          functional_types: function_types,
          teams: userInLocationCount,
          functional_type: functional_type,
          contacts
        })
      `;
    } else {
      rawQuery += `COLLECT WITH COUNT INTO length RETURN length`;
    }

    return {
      query: rawQuery,
      params,
    };
  };

  public findWithCountMemberAndFunctionType = async (id: string) => {
    const query = this.getQueryWithMemberAndFunctionType({
      id,
      relationId: null,
    });
    return head(
      await this.model.rawQueryV2(query.query, query.params)
    ) as LocationWithTeamCountAndFunctionType;
  };

  public getLocationPagination = async (
    relationId: string,
    limit?: number,
    offset?: number,
    sort: string = "country_name",
    order: SortOrder = "ASC"
  ) => {
    const query = this.getQueryWithMemberAndFunctionType({
      relationId,
      limit,
      offset,
      sort,
      order,
    });
    //
    const dataResponse = (await this.model.rawQueryV2(
      query.query,
      query.params
    )) as LocationWithTeamCountAndFunctionType[];
    let totalSize = dataResponse.length;
    if (isFinite(limit) && isFinite(offset)) {
      const totalQuery = this.getQueryWithMemberAndFunctionType({
        relationId,
        sort,
        order,
        isCount: true,
      });

      totalSize =
        head(
          await this.model.rawQueryV2(totalQuery.query, totalQuery.params)
        ) || 0;
      return {
        pagination: pagination(limit || 0, offset || 0, totalSize),
        data: dataResponse,
      };
    }
    return {
      pagination: {
        page: 1,
        page_size: totalSize,
        total: totalSize,
        page_count: 1,
      },
      data: dataResponse,
    };
  };

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

  public getCurrencyByLocationId = async (locationId: string | null) => {
    if (_.isEmpty(locationId)) {
      return "SGD";
    }
    const rawQuery = `for location in locations
    filter location.id == @locationId
    
    for country in countries
    filter country.id == location.country_id
    return country.currency
    `;
    const result = await this.model.rawQueryV2(rawQuery, { locationId });
    return result[0] as string;
  };
}

export const locationRepository = new LocationRepository();
export default LocationRepository;
