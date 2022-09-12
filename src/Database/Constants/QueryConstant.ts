import { QueryInterface } from '../Interfaces';

export const QUERY_TYPE: QueryInterface = {
  SELECT: 1,
  COUNT: 2,
  COUNT_WITHOUT_PAGINATION: 3,
  DELETE: 4,
  UPDATE: 5,
};
