import { CategoryTypeEnum } from "@/types/category.type";

export interface CategoryEntity {
  id: string;
  name: string;
  parent_id: string | null;
  type: CategoryTypeEnum;
  level: number;
}
export interface DetailedCategoryEntity extends CategoryEntity {
  relation_id: string;
  subs: CategoryEntity[];
  deleted_at: string | null;
}
