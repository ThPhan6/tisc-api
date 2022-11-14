import { Pagination } from "@/types";

export enum CollectionRelationType {
  Brand,
  CustomProduct,
}
export interface ICollectionAttributes {
  id: string;
  name: string;
  relation_id: string;
  relation_type: CollectionRelationType;
  created_at: string;
  updated_at: string | null;
}

export interface ListCollectionPaginate {
  pagination: Pagination;
  data: ICollectionAttributes[];
}

export interface ICollection
  extends Pick<ICollectionAttributes, "id" | "name" | "created_at"> {}
