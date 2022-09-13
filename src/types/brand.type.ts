export interface BrandStatus {
  ACTIVE: 1,
  INACTIVE: 2,
  PENDING: 3,
}

export type BrandStatusValue = BrandStatus[keyof BrandStatus];
export type BrandStatusKey = "Active" | "Pending" | "Inactive";

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
  status: BrandStatusValue;
  created_at: string;
  updated_at: string | null;
}
