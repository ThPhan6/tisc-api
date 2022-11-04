import { Pagination, SubCategoryAttributes } from "@/types";

export interface ICategoryAttributes {
  id: string;
  name: string;
  subs: any;
  created_at: string;
  is_deleted: boolean;
}

export interface CategoryValue {
  id: string;
  name: string;
}

export interface ICategoryRequest {
  name: string;
  subs: SubCategoryAttributes[];
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
    summary: {
      name: string;
      value: number;
    }[];
    pagination: Pagination;
  };
  statusCode: number;
}

export interface ISubCategoryItem {
  name: string;
  subs: [] | null;
}
