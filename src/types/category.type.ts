export interface CategoryValue {
  id: string;
  name: string;
}

export interface SubCategoryAttributes extends CategoryValue {
  subs: CategoryValue[];
}

export interface ICategoryAttributes {
  id: string;
  name: string;
  subs: SubCategoryAttributes[];
  created_at: string;
  updated_at: string | null;
}

export interface ListCategoryWithPaginate {
  pagination: {
    page: number;
    page_size: number;
    total: number;
    page_count: number;
  };
  data: ICategoryAttributes[];
}
