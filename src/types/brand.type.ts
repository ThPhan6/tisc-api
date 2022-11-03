import { ActiveStatus } from "@/types";

export interface BrandOfficialWebsite {
  country_id: string;
  url: string;
}

export interface BrandAttributes {
  id: string;
  name: string;
  parent_company: string;
  logo: string | null;
  slogan: string;
  mission_n_vision: string;
  official_websites: BrandOfficialWebsite[];
  team_profile_ids: string[];
  status: ActiveStatus;
  created_at: string;
  updated_at: string | null;
}

export type GetUserGroupBrandSort = "name" | "origin" | "status";
