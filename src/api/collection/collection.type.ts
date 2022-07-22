import { IPagination } from "./../../type/common.type";
export interface ICollection {
  id: string;
  name: string;
  created_at: string;
}
export interface ICollectionRequest {
  name: string;
  brand_id: string;
}
export interface ICollectionResponse {
  data: ICollection;
  statusCode: number;
}
export interface ICollectionsResponse {
  data: {
    collections: ICollection[];
    pagination: IPagination;
  };
  statusCode: number;
}
