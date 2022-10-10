import { ListBrandCustom } from "./../api/brand/brand.type";
import BrandModel from "@/model/brand.models";
import BaseRepository from "./base.repository";
import { BrandAttributes, SortOrder } from "@/types";

class BrandRepository extends BaseRepository<BrandAttributes> {
  protected model: BrandModel;
  protected DEFAULT_ATTRIBUTE: Partial<BrandAttributes> = {
    name: "",
    parent_company: "",
    logo: null,
    slogan: "",
    mission_n_vision: "",
    official_websites: [],
    team_profile_ids: [],
    status: 3,
  };

  constructor() {
    super();
    this.model = new BrandModel();
  }

  public async getAllAndSortByName() {
    return (await this.model
      .select()
      .order("name", "ASC")
      .get()) as BrandAttributes[];
  }

  public async getByIds(ids: string[]) {
    return (await this.model
      .select("id", "name")
      .whereIn("id", ids)
      .get()) as Pick<BrandAttributes, "id" | "name">[];
  }

  public async summaryUserAndLocation(
    brandId?: string | null,
    type?: "user" | "location"
  ) {
    let query = this.model.getQuery();
    if (brandId) {
      query = query.where("brands.id", "==", brandId);
    }
    if (type === "user") {
      query = query.join("users", "users.relation_id", "==", "brands.id");
    }
    if (type === "location") {
      query = query.join(
        "locations",
        "location.relation_id",
        "==",
        "brands.id"
      );
    }
    return await query.count();
  }

  public async getListBrandCustom(
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder
  ) {
    const params = {} as any;
    const rawQuery = `
      ${limit && offset ? `LIMIT ${offset}, ${limit}` : ``}
      ${sort && order ? `SORT brands.${sort} ${order}` : ``}

      LET assignTeams = (
        FOR profileId IN brands.team_profile_ids
        FOR assignTeam IN users
        FILTER assignTeam.id == profileId
        RETURN UNSET(assignTeam, [
          '_id',
          '_key',
          '_rev',
          'deleted_at', 'deleted_by','access_level',
          'backup_email',
          'created_at',
          'department_id',
          'gender',
          'interested',
          'is_verified',
          'linkedin',
          'location_id',
          'mobile',
          'password',
          'personal_mobile',
          'phone',
          'position',
          'relation_id',
          'reset_password_token',
          'retrieve_favourite',
          'role_id',
          'status',
          'type',
          'verification_token',
          'work_location'
        ])
      )

        LET users = (
          FOR users IN users
          FILTER users.relation_id == brands.id
          RETURN users
        )

        LET locations = (
            FOR locations  IN locations
            FILTER locations.relation_id == brands.id
            return locations
        )

        LET originLocations = (
            FOR originLocation  IN locations
            FILTER originLocation.relation_id == brands.id
            RETURN originLocation
        )

        LET distributors = (
            FOR  distributors IN distributors
            FILTER distributors.brand_id == brands.id
            RETURN distributors
        )

        LET collection = (
            FOR collection IN collections
            FILTER collection.brand_id == brands.id
            RETURN collection
        )

        LET cards = (
            FOR products in products
            FILTER products.brand_id == brands.id
            RETURN products
        )

        RETURN {
            brand : brands,
            locations : LENGTH(locations),
            origin_location : originLocations[0],
            collection : LENGTH(collection),
            cards : cards,
            users : LENGTH(users),
            distributors : distributors,
            assign_team : assignTeams,
        }
    `;
    return (await this.model.rawQuery(rawQuery, params)) as ListBrandCustom[];
  }

  public async getAllBrandsWithSort(sort?: any) {
    if (sort) {
      return (await this.model
        .select()
        .order(sort[0], sort[1])
        .get()) as BrandAttributes[];
    }
    return (await this.model.select().get()) as BrandAttributes[];
  }

  public async getBrandSummary() {
    return this.model
      .getQuery()
      .join("locations", "locations.relation_id", "==", "brands.id")
      .join("collections", "collections.brand_id", "==", "brands.id")
      .join("products", "products.brand_id", "==", "brands.id")
      .get(true);
  }
}

export default BrandRepository;
export const brandRepository = new BrandRepository();
