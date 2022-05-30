import Model from "./index";

export interface IDesignerAttributes {
  id: string;
  name: string;
  parent_company: string;
  logo: string;
  slogan: string;
  profile_n_philosophy: string;
  offical_website: string;
  design_capabilities: string;
  team_profile_ids: string[];
  location_ids: string[];
  status: number;
  created_at: string;
}

export default class DesignerModel extends Model<IDesignerAttributes> {
  constructor() {
    super("designers");
  }
}
