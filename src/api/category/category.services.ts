import { MESSAGES } from "@/constant/common.constant";
import { getSummaryTable, tosingleSpace } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import CategoryRepository from "@/repositories/category.repository";
import { successMessageResponse } from "./../../helper/response.helper";
import {
  checkCategoryDuplicateByName,
  mappingCategoriesUpdate,
  mappingCategoryGroup,
  mappingSortCategory,
  mappingSubCategories,
} from "./category.mapping";
import { ICategoryRequest } from "./category.type";
const uuid = require("uuid").v4;

export default class CategoryService {
  private categoryRepository: CategoryRepository;
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  public async getCategoryValues(ids: string[]) {
    const allCategoryGroup = await this.categoryRepository.getAll();
    return mappingCategoryGroup(allCategoryGroup, ids);
  }

  public async create(payload: ICategoryRequest) {
    payload.name = tosingleSpace(payload.name);
    const mainCategory = await this.categoryRepository.findBy({
      name: payload.name,
    });
    if (mainCategory) {
      return errorMessageResponse(MESSAGES.CATEGORY_EXISTED);
    }

    const categoryDuplicate = checkCategoryDuplicateByName(payload);
    if (categoryDuplicate) return errorMessageResponse(categoryDuplicate);

    const subCategories = mappingSubCategories(payload);

    const createdCategory = await this.categoryRepository.create({
      name: payload.name,
      subs: subCategories,
    });
    if (!createdCategory) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return successResponse({ data: createdCategory });
  }

  public async getList(
    limit: number,
    offset: number,
    filter: any,
    mainCategoryOrder: "ASC" | "DESC",
    subCategoryOrder: "ASC" | "DESC",
    categoryOrder: "ASC" | "DESC"
  ) {
    const categories = await this.categoryRepository.getAllCategoriesSortByName(
      limit,
      offset,
      filter,
      mainCategoryOrder
    );

    const sortedCategories = mappingSortCategory(
      categories.data,
      subCategoryOrder,
      categoryOrder
    );
    const allCategory = await this.categoryRepository.getAll();
    const summaryTable = getSummaryTable(allCategory);
    const summary = [
      {
        name: "Main Category",
        value: summaryTable.countGroup,
      },
      {
        name: "Subcategory",
        value: summaryTable.countSub,
      },
      {
        name: "Category",
        value: summaryTable.countItem,
      },
    ];
    return successResponse({
      data: {
        categories: sortedCategories,
        summary,
        pagination: categories.pagination,
      },
    });
  }

  public async getById(id: string) {
    const category = await this.categoryRepository.find(id);
    if (!category) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND, 404);
    }
    return successResponse({
      data: category,
    });
  }

  public async update(id: string, payload: ICategoryRequest) {
    const mainCategory = await this.categoryRepository.find(id);
    if (!mainCategory) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND, 404);
    }
    const duplicatedCategory =
      await this.categoryRepository.getDuplicatedCategory(id, payload.name);
    if (duplicatedCategory) {
      return errorMessageResponse(MESSAGES.MAIN_CATEGORY_DUPLICATED);
    }

    const categoryDuplicate = checkCategoryDuplicateByName(payload);
    if (categoryDuplicate) return errorMessageResponse(categoryDuplicate);

    const subCategories = mappingCategoriesUpdate(payload);

    const updatedCategory = await this.categoryRepository.update(id, {
      name: payload.name,
      subs: subCategories,
    });
    if (!updatedCategory) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    return successResponse({ data: updatedCategory });
  }

  public async delete(id: string) {
    const deletedCategory = await this.categoryRepository.findAndDelete(id);
    if (!deletedCategory) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND, 404);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}
