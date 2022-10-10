import { MESSAGES } from "@/constant/common.constant";
import {
  isDuplicatedString,
  sortObjectArray,
  toSingleSpace,
} from "@/helper/common.helper";
import { ICategoryAttributes } from "@/types/category.type";
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

export const mappingSubCategories = (mainCategory: ICategoryRequest) => {
  return mainCategory.subs.map((item) => {
    const categories = item.subs.map((element) => {
      return {
        id: uuid(),
        name: element.name,
      };
    });
    return {
      id: uuid(),
      name: item.name,
      subs: categories,
    };
  });
};

export const mappingSortCategory = (
  categories: ICategoryAttributes[],
  subCategoryOrder: "ASC" | "DESC",
  categoryOrder: "ASC" | "DESC"
) => {
  return categories.map((item: any) => {
    const sortedSubCategories = sortObjectArray(
      item.subs,
      "name",
      subCategoryOrder
    );
    const returnedSubCategories = sortedSubCategories.map((sub) => {
      return {
        ...sub,
        count: sub.subs.length,
        subs: sortObjectArray(sub.subs, "name", categoryOrder),
      };
    });
    return {
      ...item,
      count: item.subs.length,
      subs: returnedSubCategories,
    };
  });
};

export const mappingCategoriesUpdate = (categoriesGroup: ICategoryRequest) => {
  return categoriesGroup.subs.map((subCategory) => {
    const subCategories = subCategory.subs.map((category) => {
      if (category.id) {
        return {
          ...category,
          name: category.name,
        };
      }
      return {
        ...category,
        id: uuid(),
        name: category.name,
      };
    });
    if (subCategory.id) {
      return {
        ...subCategory,
        name: subCategory.name,
        subs: subCategories,
      };
    }
    return {
      ...subCategory,
      id: uuid(),
      name: subCategory.name,
      subs: subCategories,
    };
  });
};
