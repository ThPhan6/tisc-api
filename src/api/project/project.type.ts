export interface IProjectRequest {
  code: string;
  name: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  project_type_id: string;
  building_type_id: string;
  measurement_unit: number;
  design_due: string;
  construction_start: string;
  status: number;
  team_profile_ids: string[];
}

export interface IProjectResponse {
  data: any;
  statusCode: number;
}
export interface IProjectsResponse {
  data: any;
  statusCode: number;
}
export interface IAllProjectResponse {
  data: {
    id: string;
    code: string;
    name: string;
  }[];
  statusCode: number;
}

export interface IProjectSummaryResponse {
  projects: number;
  live: number;
  on_hold: number;
  archived: number;
}

export interface IProjectGroupByStatusResponse {
  data: {
    status_name: string;
    count: number;
    projects: {
      code: string;
      name: string;
      location: string;
      building_type: string;
      type: string;
      measurement_unit: number;
      design_due: string;
      construction_start: string;
    }[];
  }[];
  statusCode: number;
}
