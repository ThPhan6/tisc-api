import { IPagination, ICollection } from "@/types";

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
