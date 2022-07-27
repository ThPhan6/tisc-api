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
}

export interface IProjectResponse {
  data: any;
  statusCode: number;
}
export interface IProjectsResponse {
  data: any;
  statusCode: number;
}
