import { Pagination } from "@/types";

export interface IQuotationAttributes {
  id: string;
  author: string;
  identity: string;
  quotation: string;
  created_at: string;
  updated_at: string | null;
}

export interface ListQuotationWithPagination {
  pagination: Pagination;
  data: IQuotationAttributes[];
}
