import Model from "./index";

export interface IProjectAttributes {
  id: string;
  code: string;
  name: string;
  location: string;
  country_id: string;
  state_id: string;
  city_id: string;
  country_name: string;
  state_name: string;
  city_name: string;
  address: string;
  phone_code: string;
  postal_code: string;
  project_type: string;
  project_type_id: string;
  building_type: string;
  building_type_id: string;
  measurement_unit: number;
  design_due: string;
  construction_start: string;
  team_profile_ids: string[];

  design_id: string;
  status: number;
  created_at: string;
  is_deleted: boolean;
}

export const PROJECT_NULL_ATTRIBUTES = {
  id: "",
  code: "",
  name: "",
  location: "",
  country_id: "",
  state_id: "",
  city_id: "",
  country_name: "",
  state_name: "",
  city_name: "",
  address: "",
  phone_code: "",
  postal_code: "",
  project_type_id: "",
  project_type: "",
  building_type_id: "",
  building_type: "",
  measurement_unit: 0,
  design_due: "",
  construction_start: "",
  team_profile_ids: [],

  design_id: "",
  status: 0,
  created_at: "",
  is_deleted: false,
};

export default class ProjectModel extends Model<IProjectAttributes> {
  constructor() {
    super("projects");
  }
}
