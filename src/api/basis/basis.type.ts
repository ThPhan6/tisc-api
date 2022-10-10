import {
  BasisConversion,
  BasisOptionGroup,
  BasisOption,
  BasisPresetGroup,
  BasisPreset,
  BasisPresetValue,
} from "@/types/basis.type";
import { IPagination, ISummaryTale } from "@/types";
export interface IBasisConversionRequest {
  name: string;
  subs: Omit<BasisConversion, "id">[];
}
export interface IBasisConversionUpdateRequest {
  name: string;
  subs: BasisConversion[];
}

export interface SubBasisConversionResponse extends BasisConversion {
  conversion_between: string;
  first_formula: string;
  second_formula: string;
}

export interface IBasisConversionResponse {
  data: {
    id: string;
    name: string;
    subs: SubBasisConversionResponse[];
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
      subs: SubBasisConversionResponse[];
      created_at: string;
    }[];
    summary: ISummaryTale[];
    pagination: IPagination;
  };
  statusCode: number;
}

export interface IBasisOptionResponse {
  data: BasisOptionGroup;
  statusCode: number;
}
export interface IBasisOptionsResponse {
  data: {
    basis_options: BasisOptionGroup;
    summary: ISummaryTale[];
    pagination: IPagination;
  };
  statusCode: number;
}
export interface IBasisOptionRequest {
  name: string;
  subs: BasisOption[];
}
export interface IUpdateBasisOptionRequest {
  name: string;
  subs: BasisOption[];
}

export interface IBasisPresetResponse {
  data: BasisPresetGroup;
  statusCode: number;
}
export interface IBasisPresetsResponse {
  data: {
    basis_presets: BasisPresetGroup;
    summary: ISummaryTale[];
    pagination: IPagination;
  };
  statusCode: number;
}
export interface IBasisPresetRequest {
  name: string;
  subs: {
    name: string;
    subs: BasisPresetValue[];
  }[];
}
export interface IUpdateBasisPresetRequest {
  name: string;
  subs: Omit<BasisPreset, "count">[];
}
