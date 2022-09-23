export interface CommonTypes {
  SHARING_GROUP: 1;
  SHARING_PURPOSE: 2;
  PROJECT_BUILDING: 3;
  FINISH_SCHEDULES: 4;
  COMPANY_FUNCTIONAL: 5;
  PROJECT_INSTRUCTION: 6;
  PROJECT_TYPE: 7;
  PROJECT_REQUIREMENT: 8;
  PROJECT_UNIT: 9;
}
export type CommonTypeValue = CommonTypes[keyof CommonTypes];

export interface CommonTypeAttributes {
  id: string;
  name: string;
  type: CommonTypeValue;
  relation_id: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface IPagination {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface ISummaryTale {
  name: string;
  value: number;
}

export interface ValidImage {
  buffer: Buffer;
  path: string;
  mime_type: string;
}
