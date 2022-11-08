import { IMessageResponse, UserAttributes } from "@/types";

export interface ProjectAttributes {
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
  status: ProjectStatus;

  created_at: string;
  updated_at: boolean;
  deleted_at: boolean;
}

export enum ProjectStatus {
  "Live",
  "On Hold",
  "Archived",
}

export type ProjectStatusKey = keyof typeof ProjectStatus;

export type ProjectStatusValue = `${Extract<
  ProjectStatus,
  number
>}` extends `${infer N extends number}`
  ? N
  : never;

export interface FindUserAndProjectResponse {
  user?: UserAttributes;
  project?: ProjectAttributes;
  message: IMessageResponse;
}

export interface CreateProjectRequest {
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

export type ProjectListingSort =
  | "created_at"
  | "name"
  | "status"
  | "country_name"
  | "city_name"
  | "building_type"
  | "project_type";
