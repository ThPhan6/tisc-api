export interface CommonTypes {
  SHARING_GROUP: 1,
  SHARING_PURPOSE: 2,
  PROJECT_BUILDING: 3,
  FINISH_SCHEDULES: 4,
  COMPANY_FUNCTIONAL: 5,
  PROJECT_INSTRUCTION: 6,
  PROJECT_TYPE: 7,
  PROJECT_REQUIREMENT: 8,
  PROJECT_UNIT: 9,
}
export type CommonTypeValue =  CommonTypes[keyof CommonTypes];

export interface CommonTypeAttributes {
  id: string;
  name: string;
  type: CommonTypeValue;
  relation_id: string | null;
  created_at: string;
  updated_at: string | null;
}
