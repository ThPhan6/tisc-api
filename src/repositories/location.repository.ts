import LocationModel from "@/model/location.model";
import BaseRepository from "./base.repository";
import { ILocationAttributes, SortOrder } from "@/types";
import { isNumber } from "lodash";

class LocationRepository extends BaseRepository<ILocationAttributes> {
  protected model: LocationModel;

  constructor() {
    super();
    this.model = new LocationModel();
  }

  public getLocationPagination = async (
    limit?: number,
    offset?: number,
    relationId?: string | null,
    sort: string = "created_at",
    order: SortOrder = "DESC"
  ) => {
    let query = this.getModel().getQuery();
    if (relationId) {
      query = query.where("relation_id", "==", relationId);
    }

    query = query.order(sort, order);

    if (isNumber(limit) && isNumber(offset)) {
      query.limit(limit, offset);
      return query.paginate();
    }
    const response = await query.get();
    const totalSize = (response.length ?? 0) as number;
    return {
      pagination: {
        total: totalSize,
        page: 1,
        page_size: totalSize,
        page_count: totalSize,
      },
      data: response,
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
    const params = {} as any;
    let rawQuery = `
      FILTER locations.deleted_at == null
      FOR designer in designers
      FILTER designer.deleted_at == null
      FILTER locations.relation_id == designer.id
      RETURN locations
  `;
    return this.model.rawQuery(rawQuery, params);
  }

  public async getOriginCountry() {
    const params = {} as any;
    let rawQuery = `
      FILTER locations.deleted_at == null
      FOR designer in designers
      FILTER designer.deleted_at == null
      FILTER locations.relation_id == designer.id
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
}

export const locationRepository = new LocationRepository();
export default LocationRepository;
