import { IPagination } from "./../../type/common.type";
export interface IBasisConversionRequest {
  name: string;
  subs: {
    name_1: string;
    name_2: string;
    formula_1: string;
    formula_2: string;
    unit_1: string;
    unit_2: string;
  }[];
}
export interface IBasisConversionUpdateRequest {
  name: string;
  subs: {
    id?: string;
    name_1: string;
    name_2: string;
    formula_1: string;
    formula_2: string;
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
      first_formula: string;
      second_formula: string;
      name_1: string;
      name_2: string;
      formula_1: string;
      formula_2: string;
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
        first_formula: string;
        second_formula: string;
        name_1: string;
        name_2: string;
        formula_1: string;
        formula_2: string;
        unit_1: string;
        unit_2: string;
      }[];
      created_at: string;
    }[];
    summary: {
      name: string;
      value: number;
    }[];
    pagination: IPagination;
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
    summary: {
      name: string;
      value: number;
    }[];
    pagination: IPagination;
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
export interface IBasisPreset {
  id: string;
  name: string;
  count: number;
  subs: {
    id: string;
    name: string;
    count: number;
    subs: {
      value_1: string;
      value_2: string;
      unit_1: string;
      unit_2: string;
    }[];
  }[];

  created_at: string;
}

export interface IBasisPresetResponse {
  data: IBasisPreset;
  statusCode: number;
}
export interface IBasisPresetsResponse {
  data: {
    basis_presets: IBasisPreset;
    summary: {
      name: string;
      value: number;
    }[];
    pagination: IPagination;
  };
  statusCode: number;
}
export interface IBasisPresetRequest {
  name: string;
  subs: {
    name: string;
    subs: {
      value_1: string;
      value_2: string;
      unit_1: string;
      unit_2: string;
    }[];
  }[];
}
export interface IUpdateBasisPresetRequest {
  name: string;
  subs: {
    id: string;
    name: string;
    subs: {
      id: string;
      value_1: string;
      value_2: string;
      unit_1: string;
      unit_2: string;
    }[];
  }[];
}
