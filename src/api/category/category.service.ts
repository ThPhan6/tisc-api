import { MESSAGES } from "../../constant/common.constant";
import CategoryModel, {
  CATEGORY_NULL_ATTRIBUTES,
} from "../../model/category.model";
import { IMessageResponse } from "../../type/common.type";
import {
  ICategoriesResponse,
  ICategoryResponse,
  ICategoryAttributes,
  ICategoryRequest,
  ISubCategoryItem,
} from "./category.type";
const uuid = require("uuid").v4;

export default class CategoryService {
  private productModel: CategoryModel;
  constructor() {
    this.productModel = new CategoryModel();
  }

  private getSubCategories = async () => {
    const categories = await this.productModel.getAll();
    const listSub = categories
      ?.map((subCategory: any) => {
        if (subCategory.subs) {
          return subCategory.subs;
        }
        return undefined;
      })
      .filter((el: any) => el !== undefined);

    return listSub?.flat(1);
  };

  private getListCategory = async () => {
    const categories = await this.getSubCategories();
    const listCategory = categories
      ?.map((category: any) => {
        if (category.subs) {
          return category.subs;
        }
        return undefined;
      })
      .filter((el: any) => el !== undefined);
    return listCategory?.flat(1);
  };

  private addId = async (payload: ICategoryRequest) => {
    let listSub: any;
    return payload.subs.map((item: ISubCategoryItem) => {
      if (item.subs) {
        listSub = item.subs.map((el: ISubCategoryItem) => {
          return {
            id: uuid(),
            ...el,
          };
        });
      } else {
        return {
          id: uuid(),
          ...item,
        };
      }
      return {
        id: uuid(),
        ...item,
        subs: listSub,
      };
    });
  };

  public create = async (
    payload: ICategoryRequest
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const categoryExisted = await this.productModel.findBy({
        name: payload.name.toLowerCase(),
      });
      if (categoryExisted) {
        return resolve({
          message: MESSAGES.CATEGORY_EXISTED,
          statusCode: 400,
        });
      }
      let subs;
      if (payload.subs) {
        subs = await this.addId(payload);
      }
      const category = await this.productModel.create({
        ...CATEGORY_NULL_ATTRIBUTES,
        name: payload.name,
        subs,
      });
      if (!category) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = category;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getList = async (
    limit: number,
    offset: number,
    filter?: any,
    sort?: any
  ): Promise<IMessageResponse | ICategoriesResponse> => {
    return new Promise(async (resolve) => {
      let result = await this.productModel.list(limit, offset, filter, sort);
      if (!result) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      const mainCategoryCount = result.length;
      let subCategoryCount = 0;
      let categoryCount = 0;
      result = result.map((item: ICategoryAttributes) => {
        const { is_deleted, ...rest } = item;
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
            ...rest,
            count: item.subs.length,
            subs: subCategories,
          };
        }
        return {
          ...rest,
          count: 0,
        };
      });
      return resolve({
        data: {
          categories: result,
          main_category_count: mainCategoryCount,
          sub_category_count: subCategoryCount,
          category_count: categoryCount,
        },
        statusCode: 200,
      });
    });
  };

  public get = async (
    id: string
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const result = await this.productModel.find(id);
      if (!result) {
        return resolve({
          message: MESSAGES.CATEGORY_NOT_FOUND,
          statusCode: 404,
        });
      }
      const { is_deleted, ...rest } = result;
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
      const category = await this.productModel.find(id);
      if (!category) {
        return resolve({
          message: MESSAGES.NOT_FOUND,
          statusCode: 404,
        });
      }
      const subCategories = await this.getSubCategories();
      const categories = await this.getListCategory();
      let listSub;
      if (payload.subs) {
        let subs: any;
        listSub = payload.subs.map((item: any) => {
          const foundSub = subCategories?.find(
            (subCategory) => subCategory.id === item.id
          );

          if (item.subs) {
            subs = item.subs.map((subItem: any) => {
              const foundCategory = categories?.find(
                (category) => category.id === subItem.id
              );
              if (!foundCategory || !subItem.id) {
                return {
                  ...subItem,
                  id: uuid(),
                };
              }
              return {
                ...subItem,
              };
            });
          }
          if (!foundSub || !item.id) {
            return {
              ...item,
              id: uuid(),
              subs: subs,
            };
          }
          return {
            ...item,
            subs: subs,
          };
        });
      }
      const result = await this.productModel.update(id, {
        id,
        name: payload.name,
        subs: listSub,
      });
      if (!result) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }

      const { is_deleted, ...rest } = result;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };
  public delete = async (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const record = await this.productModel.find(id);
      if (!record) {
        return resolve({
          message: MESSAGES.NOT_FOUND,
          statusCode: 404,
        });
      }
      await this.productModel.update(id, { is_deleted: true });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
}
