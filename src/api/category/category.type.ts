export interface ICategoryAttributes {
  id: string;
  name: string;
  subs: any;
  created_at: string;
  is_deleted: boolean;
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
    categories: {
      id: string;
      name: string;
      subs: {
        id: string;
        name: string;
        subs: {
          id: string;
          name: string;
        }[];
      }[];
    }[];
    main_category_count: number;
    sub_category_count: number;
    category_count: number;
  };
  statusCode: number;
}

export interface ISubCategoryItem {
  name: string;
  subs: [] | null;
}
