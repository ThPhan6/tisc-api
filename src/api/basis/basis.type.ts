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

export interface IBasisConversionsResponse {
  data: {
    basis_conversions: {
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

export interface IBasisOption {
  id: string;
  name: string;
  count: number;
  subs: {
    id: string;
    name: string;
    count: number;
    subs: {
      image: string;
      value_1: string;
      value_2: string;
      unit_1: string;
      unit_2: string;
    }[];
  }[];

  created_at: string;
}

export interface IBasisOptionResponse {
  data: IBasisOption;
  statusCode: number;
}
export interface IBasisOptionsResponse {
  data: {
    basis_options: IBasisOption;
    group_count: number;
    option_count: number;
    value_count: number;
  };
  statusCode: number;
}
export interface IBasisOptionRequest {
  name: string;
  subs: {
    name: string;
    subs: {
      image: any;
      value_1: string;
      value_2: string;
      unit_1: string;
      unit_2: string;
    }[];
  }[];
}
export interface IUpdateBasisOptionRequest {
  name: string;
  subs: {
    id: string;
    name: string;
    subs: {
      id: string;
      image: any;
      value_1: string;
      value_2: string;
      unit_1: string;
      unit_2: string;
    }[];
  }[];
}
