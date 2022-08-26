import { MESSAGES } from "../../constant/common.constant";
import CategoryModel, {
  CATEGORY_NULL_ATTRIBUTES,
} from "../../model/category.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  isDuplicatedString,
  sortObjectArray,
  tosingleSpace,
} from "./../../helper/common.helper";
import {
  ICategoriesResponse,
  ICategoryRequest,
  ICategoryResponse,
} from "./category.type";
import ProductModel from "../../model/product.model";
const uuid = require("uuid").v4;

export default class CategoryService {
  private categoryModel: CategoryModel;
  private productModel: ProductModel;
  constructor() {
    this.categoryModel = new CategoryModel();
    this.productModel = new ProductModel();
  }

  public getCategoryValues = (
    ids: string[]
  ): Promise<{ id: string; name: string }[]> =>
    new Promise(async (resolve) => {
      const allCategoryGroup = await this.categoryModel.getAll();
      const allValue = allCategoryGroup.reduce((pre, cur) => {
        const temp: any = cur.subs.reduce((pre1: any[], cur1: any) => {
          return pre1.concat(cur1.subs);
        }, []);
        return pre.concat(temp);
      }, []);
      const values: { id: string; name: string }[] = ids.map(
        (id) =>
          allValue.find(
            (item: { id: string; name: string }) => item.id === id
          ) || { id: "", name: "" }
      );
      return resolve(values);
    });
  public create = async (
    payload: ICategoryRequest
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const mainCategory = await this.categoryModel.findBy({
        name: tosingleSpace(payload.name.toLowerCase()),
      });
      if (mainCategory) {
        return resolve({
          message: MESSAGES.CATEGORY_EXISTED,
          statusCode: 400,
        });
      }
      payload.name = tosingleSpace(payload.name);
      if (
        isDuplicatedString(
          payload.subs.map((item: any) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.SUB_CATEGORY_DUPLICATED,
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
          message: MESSAGES.CATEGORY_DUPLICATED,
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
            count: sub.subs.length,
            subs: sortObjectArray(sub.subs, "name", category_order),
          };
        });
        return {
          ...rest,
          count: item.subs.length,
          subs: returnedSubCategories,
        };
      });
      const pagination: IPagination = await this.categoryModel.getPagination(
        limit,
        offset
      );

      const allCategory = await this.categoryModel.getAll();
      const mainCategoryCount = allCategory.length;
      let subCategoryCount = 0;
      let categoryCount = 0;

      allCategory.forEach((item) => {
        if (item.subs) {
          item.subs.forEach((subCategory: any) => {
            categoryCount += subCategory.subs.length;
          });
        }
        subCategoryCount += item.subs.length;
      });

      const summary = [
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
      ];
      return resolve({
        data: {
          categories: returnedCategories,
          summary,
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
          message: MESSAGES.MAIN_CATEGORY_DUPLICATED,
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
          message: MESSAGES.SUB_CATEGORY_DUPLICATED,
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
          message: MESSAGES.CATEGORY_DUPLICATED,
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
      const products = await this.productModel.getAllByCategoryId(id);
      if (products.length === 0) {
        return resolve({
          message: MESSAGES.CATEGORY_IN_PRODUCT,
          statusCode: 400,
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
