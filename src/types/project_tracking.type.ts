export enum EProjectTrackingType {
  DESIGNER,
  BRAND,
  PARTNER,
}

export enum ProjectTrackingPriority {
  "Non",
  "High priority",
  "Mid priority",
  "Low priority",
}

export enum ProjectTrackingStage {
  "keep-in-view",
  "proposing-stage",
  "tendering-stage",
  "production-stage",
  "completed",
  "terminated",
  "unawarded",
}

export interface ProjectTrackingEntity {
  id: string;
  partner_id: string; // Foreign Key referencing partners.id
  project_stage_id: string;
  type: EProjectTrackingType;
  project_id: string;
  brand_id: string;
  read_by: string[];
  assigned_teams: string[];
  priority: number;
  project_code: string;
  project_name: string;
  location_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  project_type_id: string;
  building_type_id: string;
  date_of_tender: string;
  date_of_delivery: string;
  note: string;
  design_firm: string;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
}
