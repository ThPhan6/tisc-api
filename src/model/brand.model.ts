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
}

export default class BrandModel extends Model<IBrandAttributes> {
  constructor() {
    super("brands");
  }
}
