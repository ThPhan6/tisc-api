import { MESSAGES } from "@/constants";
import {
  getLodashOrder,
  isDuplicatedString,
  sortObjectArray,
  toSingleSpace,
  toSingleSpaceAndToLowerCase,
} from "@/helpers/common.helper";
import { ICategoryAttributes } from "@/types/category.type";
import { orderBy, sortBy } from "lodash";
import { ICategoryRequest } from "./category.type";
const uuid = require("uuid").v4;

export const mappingCategoryGroup = (
  categoryGroup: ICategoryAttributes[],
  categoryIds: string[]
) => {
  const allValue = categoryGroup.reduce((pre, cur) => {
    const temp = cur.subs.reduce((pre1, cur1: any) => {
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

export const checkCategoryDuplicateByName = (
  categoryGroup: ICategoryRequest
) => {
  categoryGroup.name = toSingleSpace(categoryGroup.name);
  if (
    isDuplicatedString(
      categoryGroup.subs.map((item) => {
        return item.name;
      })
    )
  ) {
    return MESSAGES.SUB_CATEGORY_DUPLICATED;
  }

  const categoryNames = categoryGroup.subs.map((item) => {
    return item.subs.map((element) => {
      return element.name;
    });
  });
  let isDuplicatedCategory = false;
  categoryNames.forEach((item) => {
    if (isDuplicatedString(item)) {
      isDuplicatedCategory = true;
    }
  });

  if (isDuplicatedCategory) {
    return MESSAGES.CATEGORY_DUPLICATED;
  }
};

export const mappingSortCategory = (
  categories: ICategoryAttributes[],
  subCategoryOrder: "ASC" | "DESC",
  categoryOrder: "ASC" | "DESC"
) => {
  return categories.map((item: any) => {
    const sortedSubCategories = orderBy(
      item.subs,
      "name",
      getLodashOrder(subCategoryOrder)
    );

    const mappedCategories = sortedSubCategories.map((mainCate) => ({
      ...mainCate,
      count: mainCate.subs.length,
      subs: sortObjectArray(mainCate.subs, "name", categoryOrder),
    }));
    return {
      ...item,
      count: item.subs.length,
      subs: mappedCategories,
    };
  });
};

export const mappingCategories = (categories: ICategoryRequest) => {
  return sortBy(
    categories.subs.map((mainCate) => {
      const subCategories = mainCate.subs.map((category) => ({
        ...category,
        id: category.id || uuid(),
        name: toSingleSpaceAndToLowerCase(category.name),
      }));
      return {
        ...mainCate,
        id: mainCate.id || uuid(),
        name: toSingleSpaceAndToLowerCase(mainCate.name),
        subs: subCategories,
      };
    }),
    "name"
  );
};
