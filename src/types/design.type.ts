import { IPagination } from "@/types";
export interface DesignStatus {
  ACTIVE: 1;
  INACTIVE: 2;
}
export type DesignStatusValue = DesignStatus[keyof DesignStatus];
export type DesignStatusKey = "Active" | "Inactive";

export interface DesignerAttributes {
  id: string;
  name: string;
  parent_company: string;
  logo: string | null;
  slogan: string;
  profile_n_philosophy: string;
  official_website: string;
  team_profile_ids: string[];
  status: DesignStatusValue;
  created_at: string;
  updated_at: string | null;
}

export interface ListDesignerWithPaginate {
  pagination: IPagination;
  data: DesignerAttributes[];
}
