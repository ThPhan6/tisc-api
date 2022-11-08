import { IPagination, ICollection, CollectionRelationType } from "@/types";

export interface ICollectionRequest {
  name: string;
  relation_id: string;
  relation_type: CollectionRelationType;
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
