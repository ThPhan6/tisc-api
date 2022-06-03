export interface ICategoryAttributes {
  id: string;
  name: string;
  subs: string | null;
  created_at: string;
  is_deleted: boolean;
}

export interface ICategoryRequest {
  name: string;
  subs: any;
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
    subs: any;
    created_at: string;
  };
  statusCode: number;
}
export interface ICategoriesResponse {
  data: {
    id: string;
    name: string;
    subs: [
      {
        id: string;
        name: string;
        subs: [
          {
            id: string;
            name: string;
          }
        ];
      }
    ];
  };
  statusCode: number;
}

export interface IItemSubCategory {
  name: string;
  subs: [] | null;
}
