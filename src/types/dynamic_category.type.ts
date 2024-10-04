import { CategoryTypeEnum } from "@/types/category.type";

export interface DynamicCategory {
  id: string;
  name: string;
  parent_id: string | null;
  type: CategoryTypeEnum;
  level: number;
  relation_id: string;
  subs: DynamicCategory[];
  deleted_at: string | null;
}
