import Model from "./index";

export interface IBrandAttributes {
  id: string;
  name: string;
  parent_company: string;
  logo: string;
  slogan: string;
  mission_n_vision: string;
  offical_websites: string[];
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
  offical_websites: null,
  team_profile_ids: null,
  location_ids: null,
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
      const result: any = await this.builder
        .whereNot("is_deleted", true)
        .orderBy("name", "ASC")
        .select();
      return result;
    } catch (error) {
      return false;
    }
  };
}
