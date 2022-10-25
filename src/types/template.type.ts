export enum TemplateGroup {
  Introduction = 1,
  Preamble = 2,
  BrandsAndDistributors = 3,
  FinishesMaterialAndProducts = 4,
  SchedulesAndSpecifications = 5,
  ZonesAreasRooms = 6
}

export type TemplateGroupValue = 1 | 2 | 3 | 4 | 5 | 6;
// export type TemplateGroupValue = `${Extract<
//   TemplateGroup,
//   number
// >}` extends `${infer N extends number}`
//   ? N
//   : never;


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

export type TemplateGroupType = {
  [key in TemplateGroupValue]: TemplateAttributes[]
}
