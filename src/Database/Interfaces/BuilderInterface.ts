export type GeneralOperator = '==' | '!=';
export type Operator = '==' | '!=' | '<' | '>' | '<=' | '>=' | 'like' | 'not like' | 'in' | 'not in';
export type Sequence = 'ASC' | 'DESC';
export type ValueBinding = string | number | string[] | number[] | null;

export interface WhereBinding {
  column: string;
  operator: string;
  value: ValueBinding;
  inverse: boolean;
  and: boolean;
}

export interface FromBinding {
  table: string;
  alias: string;
}

export interface JoinBinding {
  table: string;
  first: string;
  second: string;
  operator: GeneralOperator;
}

export interface OrderBinding {
  column: string;
  order: Sequence;
}

export interface BuilderBinding {
  from: FromBinding;
  select: string[];
  join: JoinBinding[];
  where: WhereBinding[];
  order: OrderBinding[];
  rawFilter: string[];
}

export interface DynamicValueBinding {
  [key: string]: ValueBinding;
}
