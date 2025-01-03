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
  zip_code: string;
  project_type: string;
  building_type: string;
  date_of_tender: string;
  date_of_delivery: string;
  note: string;
  design_firm: string;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
}
