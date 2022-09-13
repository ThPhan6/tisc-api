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
  updated_at: string;
}
