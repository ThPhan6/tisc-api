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
    return query.count();
  }

  public async getListBrandCustom(
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder
  ) {
    const params = {} as any;
    const rawQuery = `
      LET assignTeams = (
        FOR member IN users
        FILTER member.deleted_at == null
        FILTER member.id IN brands.team_profile_ids
        RETURN KEEP(member, 'id', 'email', 'avatar', 'firstname', 'lastname')
      )

      LET totalUsers = (
        FOR users IN users
        FILTER users.relation_id == brands.id
        FILTER users.deleted_at == null
        COLLECT WITH COUNT INTO length
        return length
      )

      LET locations = (
        FOR loc IN locations
        FILTER loc.relation_id == brands.id
        FILTER loc.deleted_at == null
        RETURN loc
      )

      LET distributors = (
        FOR d IN distributors
        FILTER d.brand_id == brands.id
        FILTER d.deleted_at == null
        RETURN d
      )

      LET totalCollections = (
        FOR collection IN collections
        FILTER collection.brand_id == brands.id
        FILTER collection.deleted_at == null
        COLLECT WITH COUNT INTO length
        return length
      )

      LET cards = (
        FOR products in products
        FILTER products.brand_id == brands.id
        FILTER products.deleted_at == null
        RETURN products
      )

      ${sort === "name" && order ? `SORT brands.name ${order}` : ``}
      ${
        sort === "origin" && order
          ? `SORT locations[0].country_name ${order}`
          : ``
      }

      ${limit || offset ? `LIMIT ${offset}, ${limit}` : ``}
      RETURN {
        brand: MERGE(
          KEEP(brands, 'id', 'name', 'logo', 'status', 'created_at'),
          {
            origin: locations[0].country_name,
            locations: LENGTH(locations),
            cards: LENGTH(cards),
            teams: totalUsers[0],
            collections: totalCollections[0],
            assign_team: assignTeams,
            distributors: LENGTH(distributors),
          }
        ),

        cards,
        distributors
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
