import Model from "./index";

export interface IDesignerAttributes {
  id: string;
  name: string;
  parent_company: string | null;
  logo: string | null;
  slogan: string | null;
  profile_n_philosophy: string | null;
  official_website: string | null;
  design_capabilities: string | null;
  team_profile_ids: string[];
  location_ids: string[];
  material_code_ids: string[];
  project_ids: string[];
  status: number;
  created_at: string;
  updated_at: string | null;
  is_deleted: boolean;
}

export const DESIGN_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  parent_company: null,
  logo: null,
  slogan: null,
  profile_n_philosophy: null,
  official_website: null,
  design_capabilities: null,
  team_profile_ids: [],
  location_ids: [],
  material_code_ids: [],
  project_ids: [],
  status: null,
  created_at: null,
  updated_at: null,
  is_deleted: false,
};

export default class DesignerModel extends Model<IDesignerAttributes> {
  constructor() {
    super("designers");
  }
  public getLastDeleted = async (
    email: string
  ): Promise<IDesignerAttributes | false> => {
    try {
      const result: IDesignerAttributes = await this.getBuilder()
        .builder.where("is_deleted", true)
        .where("email", email)
        .orderBy("created_at", "DESC")
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}
