export interface IQuotationAttributes {
  id: string;
  author: string;
  identity: string;
  quotation: string;
  created_at: string;
  updated_at: string | null;
}

export interface ListQuotationWithPagination {
  pagination: {
    page: number;
    page_size: number;
    total: number;
    page_count: number;
  };
  data: IQuotationAttributes[];
}
