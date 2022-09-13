import { ICategoryAttributes } from "@/types/category.type";

export const mappingCategoryGroup = (
  categoryGroup: ICategoryAttributes[],
  categoryIds: string[]
) => {
  const allValue = categoryGroup.reduce((pre, cur) => {
    const temp: any = cur.subs.reduce((pre1: any[], cur1: any) => {
      return pre1.concat(cur1.subs);
    }, []);
    return pre.concat(temp);
  }, []);
  return categoryIds.map(
    (id) =>
      allValue.find((item: { id: string; name: string }) => item.id === id) || {
        id: "",
        name: "",
      }
  );
};
