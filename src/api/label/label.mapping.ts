import { ILabelAttributes } from "@/types";

export const toNestLabels = (data: ILabelAttributes[]) => {
  const mainLabels = data.filter((item) => !item.parent_id);
  return mainLabels.map((main) => ({
    ...main,
    subs: data.filter((item) => item.parent_id === main.id),
  }));
};
