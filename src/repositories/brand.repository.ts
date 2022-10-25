import { ListBrandCustom } from "./../api/brand/brand.type";
import BrandModel from "@/model/brand.model";
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

      LET cards = (
        FOR products in products
        FILTER products.brand_id == brands.id
        FILTER products.deleted_at == null
        RETURN products
      )

      LET totalCollections = (
        FOR product IN cards
        FOR collection IN collections
        FILTER collection.id == product.collection_id
        FILTER collection.deleted_at == null
        RETURN DISTINCT collection.id
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
            collections: LENGTH(totalCollections),
            assign_team: assignTeams,
            distributors: LENGTH(distributors),
          }
        ),

        cards,
        distributors,
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

  public async getOverallSummary(): Promise<{
    brand: {
      total: number;
      totalLocation: number;
      totalUser: number;
    };
    countries: {
      regions: string[];
      summary: {
        region: string;
        count: number;
      }[];
    };
    product: {
      total: number;
      categories: number;
      collections: number;
      cards: number;
    };
  }> {
    const summary = await this.model.rawQueryV2(
      `
      LET brand = (
        FOR b in brands
        FILTER b.deleted_at == null

        LET loc = (
          FOR loc IN locations
          FILTER loc.relation_id == b.id
          FILTER loc.deleted_at == null
          LET country = (
            FOR c in countries
            FILTER c.deleted_at == null
            FILTER c.id == loc.country_id
            RETURN c
          )
          RETURN MERGE(loc, {country: country[0]})
        )
        LET user = (
          FOR u IN users
          FILTER u.relation_id == b.id
          FILTER u.deleted_at == null
          COLLECT WITH COUNT INTO length
          RETURN length
        )

        RETURN { brand: b, loc, userCount: user[0] }
      )

      LET brandLoc = (
        FOR b IN brand
        RETURN b.loc
      )
      LET locations = FLATTEN(brandLoc)

      LET users = (
        FOR b IN brand
        RETURN b.userCount
      )

      LET regions = (
        FOR c IN countries
        FILTER c.region != ""
        FILTER c.deleted_at == null
        RETURN DISTINCT c.region
      )
      LET countries = (
        FOR loc IN locations
        FILTER loc.country != null
        FILTER loc.deleted_at == null
        COLLECT group = loc.country.region INTO countryGroup
        RETURN {
          region: group,
          count: COUNT(countryGroup)
        }
      )

      LET allProducts = (
        FOR p IN products
        FILTER p.deleted_at == null
        FOR b IN brand
        FILTER p.brand_id == b.brand.id
        RETURN DISTINCT p
      )

      LET categories = (
        FOR p in allProducts 
        FOR cate1 IN categories
        FILTER cate1.deleted_at == null
        FOR cate2 IN cate1.subs
        FOR cate3 IN cate2.subs
        FILTER cate3.id IN p.category_ids
        RETURN DISTINCT cate3
      )

      LET allCollection = (
        FOR p in allProducts
        FOR coll IN collections
        FILTER coll.deleted_at == null
        FILTER coll.id == p.collection_id
        RETURN DISTINCT coll.id
      )

      LET productVariants = (
        LET basisOptionCount = (
            FOR p IN allProducts
            FOR specGroup IN p.specification_attribute_groups
            FOR attribute IN specGroup.attributes
            FILTER attribute.type == "Options"
            RETURN LENGTH(attribute.basis_options)
        )
        RETURN SUM(basisOptionCount)
      )

      RETURN {
        brand: {
          total: LENGTH(brand),
          totalLocation: LENGTH(locations),
          totalUser: SUM(users),
        },
        countries: {
          summary: countries,
          regions
        },
        product: {
          total: productVariants[0],
          collections: LENGTH(allCollection),
          categories: LENGTH(categories),
          cards: LENGTH(allProducts),
        },
      }
    `,
      {}
    );
    return summary[0];
  }
}

export default BrandRepository;
export const brandRepository = new BrandRepository();
