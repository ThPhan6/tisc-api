import {
  BasisConversion,
  BasisOptionGroup,
  BasisOption,
  BasisPreset,
  BasisPresetValue,
  BasisPresetSubGroup,
} from "@/types/basis.type";
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

export interface IBasisOptionResponse {
  data: BasisOptionGroup;
  statusCode: number;
}
export interface BasisOptionMainRequest {
  name: string;
  subs: BasisOption[];
}
export interface IBasisOptionRequest {
  brand_id: string;
  name: string;
  subs: BasisOptionMainRequest[];
}
export interface IUpdateBasisOptionRequest {
  name: string;
  subs: BasisOptionMainRequest[];
}

export interface IBasisPresetRequest {
  additional_type: BasisPresetType;
  name: string;
  subs: {
    name: string;
    subs: {
      name: string;
      subs: BasisPresetValue[];
    }[];
  }[];
}
export interface IUpdateBasisPresetRequest {
  name: string;
  subs: Omit<BasisPresetSubGroup, "count">[];
}

export enum BasisPresetType {
  general,
  feature,
}
