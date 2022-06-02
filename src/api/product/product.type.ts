export interface ICategoryAttributes {
  id: string;
  type: number;
  name: string;
  parent_id: string | null;
  created_at: string;
  is_deleted: boolean;
}

export interface ICategoryRequest {
  name: string;
  parent_id: string;
}

export interface ICategory {
  id: string;
  type: number;
  name: string;
  parent_id: string;
  created_at: string;
}

export interface ICategoryResponse {
  data: {
    id: string;
    name: string;
    parent_id: string;
    created_at: string;
  };
  statusCode: number;
}
