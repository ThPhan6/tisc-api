export type GeneralOperator = "==" | "!=";
export type Operator =
  | "=="
  | "!="
  | "<"
  | ">"
  | "<="
  | ">="
  | "like"
  | "not like"
  | "in"
  | "not in";
export type Sequence = "ASC" | "DESC";
export type ValueBinding =
  | string
  | number
  | string[]
  | number[]
  | null
  | boolean
  | object;
export type WhereInverse = false | "inverse";

export interface WhereBinding {
  column: string;
  operator: string;
  value: ValueBinding;
  inverse: WhereInverse;
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
  operator: Operator;
}

export interface OrderBinding {
  column: string;
  order: Sequence;
}

export interface PaginationBinding {
  limit?: number;
  offset?: number;
}

export interface BuilderBinding {
  from: FromBinding;
  select: string[];
  join: JoinBinding[];
  where: WhereBinding[];
  order: OrderBinding[];
  pagination?: PaginationBinding;
  isCombineJoinSelect: boolean;
}

export interface DynamicValueBinding {
  [key: string]: ValueBinding;
}
