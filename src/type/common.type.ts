export interface IMessageResponse {
  message: string;
  statusCode: number;
}

export interface IPagination {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export type SystemType = 1 | 2 | 3;
export interface ISystemType {
  TISC: SystemType;
  BRAND: SystemType;
  DESIGN: SystemType;
}

export type SortOrder = "ASC" | "DESC";

export type OrderMethodValue = 1 | 2;
export type OrderMethodKey = "Direct Purchase" | "Custom Order";

export type ConsiderProductStatusValue = 1 | 2 | 3;
export type ConsiderProductStatusKey =
  | "Considered"
  | "Re-considered"
  | "Unlisted";

export type InterestedInValue = 1 | 2 | 3 | 4 | 5;
export type InterestedInKey =
  | "Brand Factory/Showroom Visits"
  | "Design Conferences/Events/Seminars"
  | "Industry Exhibitions/Trade Shows"
  | "Product Launches/Promotions/Workshops"
  | "Product Recommendations/Updates";

export type MeasurementUnitValue = 1 | 2;
export type MeasurementUnitKey = "Metric" | "Imperial";

export type ProjectStatusValue = 1 | 2 | 3;
export type ProjectStatusKey = "Live" | "On Hold" | "Archive";

export type RegionKey =
  | "africa"
  | "asia"
  | "europe"
  | "north america"
  | "oceania"
  | "south america";

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

export type BrandStatusValue = 1 | 2 | 3;
export type BrandStatusKey = "Active" | "Pending" | "Inactive";

export type DesignStatusValue = 1 | 2;
export type DesignStatusKey = "Active" | "Inactive";

export type AttributeType = 1 | 2 | 3;
export type DocumentationType = 1 | 2 | 3 | 4;

export type SpecifiedProductGetlistType = "brand" | "material" | "space";

export type SpecifiedProductStatusValue = 1 | 2 | 3;
export type SpecifiedProductStatusKey =
  | "Cancelled"
  | "Re-specified"
  | "Specified";

export interface ISummaryTale {
  name: string;
  value: number;
}
