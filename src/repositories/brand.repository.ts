import { ListBrandCustom } from "./../api/brand/brand.type";
import BrandModel from "@/model/brand.model";
import BaseRepository from "./base.repository";
import {
  ActiveStatus,
  BrandAttributes,
  GetUserGroupBrandSort,
  LocationType,
  SortOrder,
  UserAttributes,
  UserStatus,
} from "@/types";

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
    status: ActiveStatus.Pending,
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

  public async getListBrandCustom(
    limit: number,
    offset: number,
    sort: GetUserGroupBrandSort,
    order: SortOrder,
    haveProduct?: boolean
  ) {
    const rawQuery = `
      FILTER brands.deleted_at == null
      ${
        haveProduct
          ? `
        LET haveProduct = LENGTH(FOR p IN products FILTER p.brand_id == brands.id LIMIT 1 RETURN true)
        FILTER haveProduct > 0
      `
          : ""
      } 
      LET assignTeams = (
        FOR member IN users
        FILTER member.deleted_at == null
        FILTER member.status == @activeStatus
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

      LET brandLocations = (
        FOR loc IN locations
        FILTER loc.relation_id == brands.id
        FILTER loc.type == @brandLocation
        FILTER loc.deleted_at == null
        RETURN loc
      )

      LET distributors = (
        FOR d IN distributors
        FILTER d.brand_id == brands.id
        FILTER d.deleted_at == null
        FOR loc IN locations
        FILTER loc.id == d.location_id
        RETURN MERGE(d, loc)
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

      ${
        sort === "origin"
          ? `SORT brandLocations[0].country_name ${order}`
          : `SORT brands.${sort} ${order}`
      }

      ${limit || offset ? `LIMIT ${offset}, ${limit}` : ""}
      RETURN {
        brand: MERGE(
          KEEP(brands, 'id', 'name', 'logo', 'status', 'created_at'),
          {
            origin: brandLocations[0].country_name,
            locations: LENGTH(brandLocations),
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
    return (await this.model.rawQuery(rawQuery, {
      activeStatus: UserStatus.Active,
      brandLocation: LocationType.brand,
    })) as ListBrandCustom[];
  }

  public async getTiscWorkspace(
    userId: string,
    sort: string,
    order: SortOrder
  ): Promise<{
    id: string;
    created_at: string;
    name: string;
    logo: string;
    country: string;
    category_count: number;
    collection_count: number;
    card_count: number;
    teams: Pick<UserAttributes, "id" | "firstname" | "lastname" | "avatar">[];
  }> {
    return this.model.rawQuery(
      `
      FILTER brands.deleted_at == null

      LET teams = (
        FOR user IN users
        FILTER user.deleted_at == null
        FILTER user.status == @activeStatus
        FILTER user.id IN brands.team_profile_ids
        RETURN KEEP(user, 'id', 'firstname', 'lastname', 'avatar')
      )

      FILTER @userId IN teams[*].id

      LET locations = (
        FOR loc IN locations
        FILTER loc.relation_id == brands.id
        FILTER loc.type == @brandLocation
        FILTER loc.deleted_at == null
        RETURN loc
      )

      LET cards = (
        FOR products in products
        FILTER products.brand_id == brands.id
        FILTER products.deleted_at == null
        RETURN products
      )
      
      LET categories = (
        FOR product IN cards
        FOR categories IN categories
        FILTER categories.deleted_at == null
        FOR subCategory IN categories.subs
        FOR category IN subCategory.subs
        FILTER category.id IN product.category_ids
        RETURN DISTINCT category.id
      )

      LET collections = (
        FOR product IN cards
        FOR collection IN collections
        FILTER collection.id == product.collection_id
        FILTER collection.deleted_at == null
        RETURN DISTINCT collection.id
      )

      SORT brands.@sort @order

      RETURN MERGE(
        KEEP(brands, 'id', 'created_at', 'name', 'logo'),
        {
          country: locations[0].country_name ? locations[0].country_name : 'N/A',
          category_count: LENGTH(categories),
          collection_count: LENGTH(collections),
          card_count: LENGTH(cards),
          teams
        }
      )
    `,
      {
        userId,
        sort,
        order,
        activeStatus: UserStatus.Active,
        brandLocation: LocationType.brand,
      }
    );
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
          FILTER loc.type == @brandLocation
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
          FILTER u.status == @activeStatus
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
      { activeStatus: UserStatus.Active, brandLocation: LocationType.brand }
    );
    return summary[0];
  }
}

export default BrandRepository;
export const brandRepository = new BrandRepository();
