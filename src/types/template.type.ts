export enum TemplateGroup {
  "Introduction",
  "Preamble",
  "BrandsAndDistributors",
  "FinishesMaterialAndProducts",
  "SchedulesAndSpecifications",
  "ZonesAreasRooms"
}

export type TemplateGroupValue = 0 | 1 | 2 | 3 | 4 | 5;

export interface TemplateAttributes {
  id: string;
  name: string;
  preview_url: string;
  pdf_url: string;
  sequence: number;
  group: TemplateGroupValue; // need to define type here
  created_at: string;
  updated_at: string;
}

export interface TemplateSpecify {
  cover: {
    name: string;
    items: TemplateAttributes[];
  }[];
  specification: {
    name: string;
    items: TemplateAttributes[];
  }[];
}
