import { ProjectStatusValue, ProjectTrackingPriority } from "@/types";

export interface GetProjectListFilter {
  project_status: ProjectStatusValue;
  priority: ProjectTrackingPriority;
}

export type GetProjectListSort =
  | "created_at"
  | "project_name"
  | "project_location"
  | "project_type"
  | "design_firm";
