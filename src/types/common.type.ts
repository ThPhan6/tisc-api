export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface ValidImage {
  buffer: Buffer;
  path: string;
  mime_type: string;
}

export type SortOrder = "ASC" | "DESC";

export type MeasurementUnitValue = 1 | 2;
export type MeasurementUnitKey = "Metric" | "Imperial";

export type FunctionalTypeValue = 1 | 2 | 3;
export type FunctionalTypeKey = "Main office" | "Satellite office" | "Other";

export type SummaryInfo = {
  id: string;
  quantity: number;
  label: string;
  subs?: SummaryInfo[];
};

export enum RespondedOrPendingStatus {
  "Pending",
  "Responded",
}

export enum ActiveStatus {
  Active = 1,
  Inactive = 2,
  Pending = 3,
}
export type ActiveStatusKey = keyof typeof ActiveStatus;
export type ActiveStatusValue = `${Extract<
  ActiveStatus,
  number
>}` extends `${infer N extends number}`
  ? N
  : never;

export type InterestedInValue = 1 | 2 | 3 | 4 | 5;
export type InterestedInKey =
  | "Brand Factory/Showroom Visits"
  | "Design Conferences/Events/Seminars"
  | "Industry Exhibitions/Trade Shows"
  | "Product Launches/Promotions/Workshops"
  | "Product Recommendations/Updates";

export type TargetedForValue = 1 | 2 | 3 | 4 | 5;
export type TargetedForKey =
  | "TISC Team"
  | "Brand"
  | "Design Firm"
  | "Distributor"
  | "General";

export type TopicTypeValue = 1 | 2 | 3 | 4 | 5;
export type TopicTypeKey =
  | "Marketing"
  | "Messages"
  | "Onboard"
  | "Operation"
  | "Other";

export enum MeasurementUnit {
  Imperial = 1,
  Metric = 2,
}

export const ALL_REGIONS = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Polar",
];
