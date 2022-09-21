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
  pagination: {
    page: number;
    page_size: number;
    total: number;
    page_count: number;
  };
  data: IAutoEmailAttributes[];
}
