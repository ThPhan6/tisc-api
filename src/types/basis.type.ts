export interface IBasisAttributes {
  id: string;
  type: number;
  name: string;
  subs: any;
  created_at: string;
  is_deleted: boolean;
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

export interface BasisOptionValue {
  id: string;
  image: string | null;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
}

export interface BasisOption {
  id: string;
  name: string;
  count?: number;
  subs: BasisOptionValue[];
}
