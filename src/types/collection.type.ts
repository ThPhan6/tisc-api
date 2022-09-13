export interface ICollectionAttributes {
  brand_id: string;
  created_at: string;
  id: string;
  name: string;
  updated_at: string | null;
}

export interface ListCollectionPaginate {
  pagination: {
    page: number;
    page_size: number;
    total: number;
    page_count: number;
  };
  data: ICollectionAttributes[];
}

export interface ICollection {
  id: string;
  name: string;
  created_at: string;
}
