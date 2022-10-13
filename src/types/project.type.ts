import { UserAttributes, IMessageResponse } from "@/types";

export enum ProjectStatus {
  "Live",
  "On Hold",
  "Archive",
}

export type ProjectStatusKey = keyof typeof ProjectStatus;

export type ProjectStatusValue = `${Extract<
  ProjectStatus,
  number
>}` extends `${infer N extends number}`
  ? N
  : never;

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

  product_ids: string[];

  design_id: string;
  status: number;
  created_at: string;
  updated_at: boolean;
}

export interface FindUserAndProjectResponse {
  user?: UserAttributes;
  project?: ProjectAttributes;
  message: IMessageResponse;
}
