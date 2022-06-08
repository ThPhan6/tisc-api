export interface IBasisConversionRequest {
  name: string;
  subs: {
    name_1: string;
    name_2: string;
    forumla_1: number;
    forumla_2: number;
    unit_1: string;
    unit_2: string;
  }[];
}

export interface IBasisConversionResponse {
  data: {
    id: string;
    name: string;
    subs: {
      id: string;
      conversion_between: string;
      first_forumlar: string;
      second_forumlar: string;
      name_1: string;
      name_2: string;
      forumla_1: number;
      forumla_2: number;
      unit_1: string;
      unit_2: string;
    }[];
    created_at: string;
  };
  statusCode: number;
}

export interface IBasesConversionResponse {
  data: {
    bases_conversion: {
      id: string;
      name: string;
      count: number;
      subs: {
        conversion_between: string;
        first_forumlar: string;
        second_forumlar: string;
        name_1: string;
        name_2: string;
        forumla_1: number;
        forumla_2: number;
        unit_1: string;
        unit_2: string;
      }[];
      created_at: string;
    }[];
    conversion_group_count: number;
    conversion_count: number;
  };
  statusCode: number;
}
