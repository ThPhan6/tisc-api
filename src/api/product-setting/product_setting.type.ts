export interface IProductSettingAttributes {
  id: string;
  name: string;
  subs: any;
  type: number;
  created_at: string;
  is_deleted: boolean;
}

export interface IProductSettingRequest {
  name: string;
  subs: any;
}

export interface IProductSettingResponse {
  data: {
    id: string;
    name: string;
    subs: any;
    created_at: string;
  };
  statusCode: number;
}
export interface ICategoryResponse {
  data: {
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
    mainCategoryCount: number;
    subCategoryCount: number;
    categoryCount: number;
  };
  statusCode: number;
}

export interface IItemSubCategory {
  name: string;
  subs: [] | null;
}
