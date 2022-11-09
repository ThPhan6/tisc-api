import { IPagination } from "@/types";

export enum CollectionRelation {
  Brand,
  CustomLibrary
}
export type CollectionRelationType = 0 | 1;

export interface ICollectionAttributes {
  id: string;
  name: string;
  relation_id: string;
  relation_type: CollectionRelationType;
  created_at: string;
  updated_at: string | null;
}

export interface ListCollectionPaginate {
  pagination: IPagination;
  data: ICollectionAttributes[];
}

export interface ICollection extends Pick<ICollectionAttributes, 'id' | 'name' | 'created_at'> {}
