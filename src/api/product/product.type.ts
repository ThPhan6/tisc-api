export interface ICategoryAttributes {
  id: string;
  name: string;
  subs: string | null;
  type: number;
  created_at: string;
  is_deleted: boolean;
}

export interface IProductRequest {
  name: string;
  subs: any;
}

export interface ICategoryRequest {
  name: string;
  subs: any;
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
    subs:
      | [
          {
            id: string;
            name: string;
            subs:
              | [
                  {
                    id: string;
                    name: string;
                  }
                ]
              | null;
          }
        ]
      | null;
  };
  statusCode: number;
}

export interface IItemSubCategory {
  name: string;
  subs: [] | null;
}
