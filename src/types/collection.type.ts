export interface ICollectionAttributes {
  id: string;
  brand_id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
}

export interface ListCollectionPaginate {
  pagination: {
    page: number;
    page_size: number;
    total: number;
    page_count: number;
  };
  data: any;
}

export interface ICollection {
  id: string;
  name: string;
  created_at: string;
}
