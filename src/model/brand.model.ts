import Model from "./index";

export interface IBrandAttributes {
  id: string;
  name: string;
  parent_company: string | null;
  logo: string | null;
  slogan: string | null;
  mission_n_vision: string | null;
  official_websites: {
    country_id: string;
    url: string;
  }[];
  team_profile_ids: string[];
  location_ids: string[];
  status: number;
  created_at: string;
  updated_at: string | null;
}

export const BRAND_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  parent_company: null,
  logo: null,
  slogan: null,
  mission_n_vision: null,
  official_websites: [],
  team_profile_ids: [],
  location_ids: [],
  status: null,
  created_at: null,
  updated_at: null,
  is_deleted: false,
};

export default class BrandModel extends Model<IBrandAttributes> {
  constructor() {
    super("brands");
  }
  public getAllAndSortByName = async () => {
    try {
      const result: any = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .orderBy("name", "ASC")
        .select();
      return result;
    } catch (error) {
      return false;
    }
  };

  public getByIds = async (
    ids: string[]
  ): Promise<Pick<IBrandAttributes, 'id' | 'name'>[]> => {
    try {
      const result = await this.getBuilder()
        .builder.whereIn("id", ids)
        .select(['id', 'name']);
      return result;
    } catch (error) {
      return [];
    }
  };

  public summaryUserAndLocation = async (
    brand_id?: string | null,
    type?: 'user' | 'location'
  ) => {
    const params = {} as any;
    let rawQuery = `FOR brand in brands `;
    if (brand_id) {
      rawQuery += ` FILTER brand.id == @brandId `;
      params.brandId = brand_id;
    }

    if (type === 'user') {
      rawQuery += ` FOR user in users
        FILTER user.relation_id == brand.id
        FILTER user.is_deleted == false `;
    }
    if (type === 'location') {
      rawQuery += ` FOR location in locations
        FILTER location.relation_id == brand.id
        FILTER location.is_deleted == false `;
    }
    // FILTER LOWER(country.region) == 'asia'
    rawQuery += `COLLECT WITH COUNT INTO length RETURN {count: length}`;

    let result: any = await this.getBuilder().raw(rawQuery, params);
    if (result._result && result._result[0] && result._result[0].count) {
      return result._result[0].count as number;
    }
    return 0;
  }
}
