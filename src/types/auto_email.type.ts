import { Pagination } from "@/types";

export interface IAutoEmailAttributes {
  id: string;
  topic: number;
  targeted_for: number;
  title: string;
  message: string;
  created_at: string;
  updated_at: string | null;
}

export interface ListAutoEmailWithPaginate {
  pagination: Pagination;
  data: IAutoEmailAttributes[];
}
