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
  updated_at: string | null;
}

export const DESIGN_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  parent_company: null,
  logo: null,
  slogan: null,
  profile_n_philosophy: null,
  offical_website: null,
  design_capabilities: null,
  team_profile_ids: null,
  location_ids: null,
  status: null,
  created_at: null,
  updated_at: null,
};

export default class DesignerModel extends Model<IDesignerAttributes> {
  constructor() {
    super("designers");
  }
}
