import { Pagination } from "@/types";

export interface ICollectionAttributes {
  brand_id: string;
  created_at: string;
  id: string;
  name: string;
  updated_at: string | null;
}

export interface ListCollectionPaginate {
  pagination: Pagination;
  data: ICollectionAttributes[];
}

export interface ICollection {
  id: string;
  name: string;
  created_at: string;
}
