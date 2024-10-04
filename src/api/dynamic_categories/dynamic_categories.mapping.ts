import { DetailedCategoryEntity } from "@/types";
import { groupBy, isEmpty } from "lodash";

export const mappingDynamicCategories = (
  categories: DetailedCategoryEntity[],
  relationId: string
) => {
  const filteredCategories = categories.filter(
    (category) =>
      category.relation_id === relationId && isEmpty(category.deleted_at)
  );

  // Create a map to group categories by their parent_id
  const categoryMap = groupBy(
    filteredCategories,
    (category) => category.parent_id || ""
  );

  const rootCategories: DetailedCategoryEntity[] = categoryMap[""] || [];

  const stack: DetailedCategoryEntity[] = [...rootCategories];

  while (stack.length) {
    const category = stack.pop();
    if (category) {
      const subs = categoryMap[category.id] || [];
      category.subs = subs;
      stack.push(...subs);
    }
  }

  return rootCategories;
};
