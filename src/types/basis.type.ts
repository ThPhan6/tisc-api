export interface IBasisAttributes {
  id: string;
  type: number;
  name: string;
  subs: any;
  created_at: string;
  updated_at: boolean;
}

export interface BasisConversion {
  id?: string;
  name_1: string;
  name_2: string;
  formula_1: string;
  formula_2: string;
  unit_1: string;
  unit_2: string;
}

export interface BasisOptionGroup {
  id: string;
  name: string;
  count: number;
  subs: BasisOption[];
  created_at: string;
}

export interface BasisOptionValue {
  id?: string;
  image: string | null;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
}

export interface BasisOption {
  id?: string;
  name: string;
  count?: number;
  is_have_image?: boolean;
  subs: BasisOptionValue[];
}

export interface BasisPresetGroup {
  id: string;
  name: string;
  count: number;
  subs: BasisPreset[];
  created_at: string;
}

export interface BasisPreset {
  id: string;
  name: string;
  count: number;
  subs: BasisPresetValue[];
}

export interface BasisPresetValue {
  id?: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
}

export interface ListBasisWithPagination {
  pagination: {
    page: number;
    page_size: number;
    total: number;
    page_count: number;
  };
  data: IBasisAttributes[];
}
