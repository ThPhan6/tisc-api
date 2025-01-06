import { CreateProjectRequestBody } from "@/models/project_request.model";
import {
  DesignerAttributes,
  EProjectTrackingType,
  ProjectStatusValue,
  ProjectTrackingEntity,
  ProjectTrackingPriority,
  ProjectTrackingStage,
} from "@/types";

export interface GetProjectListFilter {
  project_status: ProjectStatusValue;
  priority: ProjectTrackingPriority;
  project_stage: ProjectTrackingStage;
  type: EProjectTrackingType;
}

export type GetProjectListSort =
  | "created_at"
  | "project_code"
  | "project_name"
  | "project_location"
  | "project_partner"
  | "project_type"
  | "design_firm";

export interface ProjectTrackingBrandRequest
  extends Pick<
    ProjectTrackingEntity,
    | "project_name"
    | "address"
    | "city_id"
    | "state_id"
    | "date_of_delivery"
    | "date_of_tender"
    | "design_firm"
    | "location_id"
    | "note"
    | "partner_id"
    | "project_code"
    | "project_stage_id"
    | "project_type_id"
    | "building_type_id"
    | "postal_code"
    | "priority"
  > {}

export interface ProjectTrackingCreateRequest
  extends CreateProjectRequestBody,
    ProjectTrackingEntity {}

export interface ProjectTrackingListResponse extends ProjectTrackingEntity {
  project_partner: string;
  project_location: string;
  project_type: string;
  project_stage: string;
  members: DesignerAttributes[];
}
