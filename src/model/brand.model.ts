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
}
