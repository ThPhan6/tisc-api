import { IPagination } from "@/types";
export enum DesignFirmStatus {
  Active = 1,
  Inactive = 2,
}

export type DesignFirmStatusKey = keyof typeof DesignFirmStatus;

export type DesignFirmStatusValue = `${Extract<
  DesignFirmStatus,
  number
>}` extends `${infer N extends number}`
  ? N
  : never;

export interface DesignerAttributes {
  id: string;
  name: string;
  parent_company: string;
  logo: string | null;
  slogan: string;
  profile_n_philosophy: string;
  official_website: string;
  status: DesignFirmStatus;
  created_at: string;
  updated_at: string | null;
  capabilities: string[];
}

export interface ListDesignerWithPaginate {
  pagination: IPagination;
  data: DesignerAttributes[];
}
