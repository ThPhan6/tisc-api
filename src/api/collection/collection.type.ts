import { Pagination, ICollection, CollectionRelationType } from "@/types";

export interface ICollectionRequest {
  name: string;
  relation_id: string;
  relation_type: CollectionRelationType;
}
export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  images?: string[];
  brand_id?: string
}
export interface ICollectionResponse {
  data: ICollection;
  statusCode: number;
}
export interface ICollectionsResponse {
  data: {
    collections: ICollection[];
    pagination: Pagination;
  };
  statusCode: number;
}
