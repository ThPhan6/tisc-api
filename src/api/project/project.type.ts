export interface ProjectAttributes {
  id: string;
  code: string;
  name: string;
  location_id: string;
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

export type ProjectListingSort =
  | "created_at"
  | "name"
  | "status"
  | "country_name"
  | "city_name"
  | "building_type"
  | "project_type";
