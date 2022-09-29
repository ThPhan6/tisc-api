import LocationModel from "@/model/location.models";
import BaseRepository from "./base.repository";
import { ILocationAttributes } from "@/types";

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
    sort?: string,
    order: "ASC" | "DESC" = "ASC"
  ) => {
    let query = this.getModel().getQuery();
    if (relationId) {
      query = query.where("relation_id", "==", relationId);
    }

    if (sort && order) {
      query = query.order(sort, order);
    }

    if (limit && offset) {
      query.limit(limit, offset);
      return await query.paginate();
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
    FOR designer in designers
      FOR location in locations
        FOR locationDesign in designer.location_ids
        FILTER locationDesign == location.id
        RETURN location
  `;
    return this.model.rawQuery(rawQuery, params);
  }

  public async getOriginCountry() {
    const params = {} as any;
    let rawQuery = `
      FOR designer in designers
        FOR location in locations
          FILTER designer.location_ids[0] == location.id
          RETURN location.country_id
    `;
    return this.model.rawQuery(rawQuery, params);
  }
}

export const locationRepository = new LocationRepository();
export default LocationRepository;
