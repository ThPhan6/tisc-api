export type ValueOf<T> = T[keyof T];

export interface QueryInterface {
  SELECT: 1,
  COUNT: 2,
  COUNT_WITHOUT_PAGINATION: 3,
  DELETE: 4,
  UPDATE: 5,
}

export type QueryType = ValueOf<QueryInterface>;
