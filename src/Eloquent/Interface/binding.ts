export type WhereOperator = '==' | '!=' | '<' | '>' | '<=' | '>=' | 'like' | 'not like' | 'in' | 'not in';

export interface WhereBinding {
  column: string;
  operator?: string;
  value?: string | number | string[] | number[];
}

export interface WhereArrayBinding {
  column: string;
  value?: string[] | number[];
}

export interface FromBinding {
  table: string;
  alias: string;
}

export interface JoinBinding {
  table: string;
  alias: string;
  first: string;
  second: string;
}

export interface OrderBinding {
  column: string;
  order: 'ASC' | 'DESC';
}

export interface BuilderBinding {
  select: string[],
  join: JoinBinding[];
  where: WhereBinding[];
  order: OrderBinding[];
}
