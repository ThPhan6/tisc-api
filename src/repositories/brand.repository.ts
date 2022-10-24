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

      LET users = (
        FOR users IN users
        FILTER users.relation_id == brands.id
        FILTER users.deleted_at == null
        RETURN users
      )

      LET locations = (
        FOR locations  IN locations
        FILTER locations.relation_id == brands.id
        FILTER locations.deleted_at == null
        return locations
      )

      LET distributors = (
        FOR  distributors IN distributors
        FILTER distributors.brand_id == brands.id
        FILTER distributors.deleted_at == null
        RETURN distributors
      )

      LET collection = (
        FOR collection IN collections
        FILTER collection.brand_id == brands.id
        FILTER collection.deleted_at == null
        RETURN collection
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
        brand: brands,
        locations: LENGTH(locations),
        origin_location: locations[0],
        collection: LENGTH(collection),
        cards: cards,
        users: LENGTH(users),
        distributors: distributors,
        assign_team: assignTeams,
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
