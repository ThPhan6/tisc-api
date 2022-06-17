import { MESSAGES } from "../../constant/common.constant";
import CategoryModel, {
  CATEGORY_NULL_ATTRIBUTES,
} from "../../model/category.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  isDuplicatedString,
  sortObjectArray,
} from "./../../helper/common.helper";
import {
  ICategoriesResponse,
  ICategoryAttributes,
  ICategoryRequest,
  ICategoryResponse,
} from "./category.type";
const uuid = require("uuid").v4;

export default class CategoryService {
  private categoryModel: CategoryModel;
  constructor() {
    this.categoryModel = new CategoryModel();
  }

  private addCount = (data: any) => {
    const mainCategoryCount = data.length;
    let subCategoryCount = 0;
    let categoryCount = 0;
    const result = data.map((item: ICategoryAttributes) => {
      if (item.subs) {
        const subCategories = item.subs.map((el: ICategoryAttributes) => {
          if (el.subs) {
            categoryCount += el.subs.length;
            return {
              ...el,
              count: el.subs.length,
            };
          }
          return {
            ...el,
            count: 0,
          };
        });
        subCategoryCount += item.subs.length;
        return {
          ...item,
          count: item.subs.length,
          subs: subCategories,
        };
      }
      return {
        ...item,
        count: 0,
      };
    });
    return {
      categories: result,
      summary: [
        {
          name: "Main Category",
          value: mainCategoryCount,
        },
        {
          name: "Subcategory",
          value: subCategoryCount,
        },
        {
          name: "Category",
          value: categoryCount,
        },
      ],
    };
  };

  public create = async (
    payload: ICategoryRequest
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const mainCategory = await this.categoryModel.findBy({
        name: payload.name.toLowerCase(),
      });
      if (mainCategory) {
        return resolve({
          message: MESSAGES.CATEGORY_EXISTED,
          statusCode: 400,
        });
      }
      if (
        isDuplicatedString(
          payload.subs.map((item: any) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.DUPLICATED_SUB_CATEGORY,
          statusCode: 400,
        });
      }

      const categoryNames = payload.subs.map((item: any) => {
        return item.subs.map((element: any) => {
          return element.name;
        });
      });
      let isDuplicatedCategory = false;
      categoryNames.forEach((item: any) => {
        if (isDuplicatedString(item)) {
          isDuplicatedCategory = true;
        }
      });

      if (isDuplicatedCategory) {
        return resolve({
          message: MESSAGES.DUPLICATED_CATEGORY,
          statusCode: 400,
        });
      }

      const subCategories = payload.subs.map((item: any) => {
        const categories = item.subs.map((element: any) => {
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

      const createdCategory = await this.categoryModel.create({
        ...CATEGORY_NULL_ATTRIBUTES,
        name: payload.name,
        subs: subCategories,
      });
      if (!createdCategory) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = createdCategory;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getList = async (
    limit: number,
    offset: number,
    filter: any,
    main_category_order: "ASC" | "DESC",
    sub_category_order: "ASC" | "DESC",
    category_order: "ASC" | "DESC"
  ): Promise<IMessageResponse | ICategoriesResponse> => {
    return new Promise(async (resolve) => {
      const categories = await this.categoryModel.list(limit, offset, filter, [
        "name",
        main_category_order,
      ]);

      const returnedCategories = categories.map((item: any) => {
        const { is_deleted, ...rest } = item;
        const sortedSubCategories = sortObjectArray(
          item.subs,
          "name",
          sub_category_order
        );
        const returnedSubCategories = sortedSubCategories.map((sub) => {
          return {
            ...sub,
            subs: sortObjectArray(sub.subs, "name", category_order),
          };
        });
        return {
          ...rest,
          subs: returnedSubCategories,
        };
      });
      const pagination: IPagination = await this.categoryModel.getPagination(
        limit,
        offset
      );
      const result = this.addCount(returnedCategories);
      return resolve({
        data: {
          categories: result.categories,
          summary: result.summary,
          pagination,
        },
        statusCode: 200,
      });
    });
  };

  public getById = async (
    id: string
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const category = await this.categoryModel.find(id);
      if (!category) {
        return resolve({
          message: MESSAGES.CATEGORY_NOT_FOUND,
          statusCode: 404,
        });
      }
      const { is_deleted, ...rest } = category;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public update = async (
    id: string,
    payload: ICategoryRequest
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const mainCategory = await this.categoryModel.find(id);
      if (!mainCategory) {
        return resolve({
          message: MESSAGES.CATEGORY_NOT_FOUND,
          statusCode: 404,
        });
      }

      const duplicatedCategory = await this.categoryModel.getDuplicatedCategory(
        id,
        payload.name
      );
      if (duplicatedCategory) {
        return resolve({
          message: MESSAGES.DUPLICATED_MAIN_CATEGORY,
          statusCode: 400,
        });
      }

      if (
        isDuplicatedString(
          payload.subs.map((item: any) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.DUPLICATED_SUB_CATEGORY,
          statusCode: 400,
        });
      }
      const categoryNames = payload.subs.map((item: any) => {
        return item.subs.map((element: any) => {
          return element.name;
        });
      });
      let isDuplicatedCategory = false;
      categoryNames.forEach((item: any) => {
        if (isDuplicatedString(item)) {
          isDuplicatedCategory = true;
        }
      });

      if (isDuplicatedCategory) {
        return resolve({
          message: MESSAGES.DUPLICATED_CATEGORY,
          statusCode: 400,
        });
      }

      const subCategories = payload.subs.map((item: any) => {
        const categories = item.subs.map((element: any) => {
          if (element.id) {
            return {
              ...element,
              name: element.name,
            };
          }
          return {
            ...element,
            id: uuid(),
            name: element.name,
          };
        });
        if (item.id) {
          return {
            ...item,
            name: item.name,
            subs: categories,
          };
        }
        return {
          ...item,
          id: uuid(),
          name: item.name,
          subs: categories,
        };
      });
      const updatedCategory = await this.categoryModel.update(id, {
        id,
        name: payload.name,
        subs: subCategories,
      });
      if (!updatedCategory) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = updatedCategory;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public delete = async (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const category = await this.categoryModel.find(id);
      if (!category) {
        return resolve({
          message: MESSAGES.CATEGORY_NOT_FOUND,
          statusCode: 404,
        });
      }
      await this.categoryModel.update(id, { is_deleted: true });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
}
