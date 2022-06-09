import { sortObjectArray } from "./../../helper/common.helper";
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
  private categoyModel: CategoryModel;
  constructor() {
    this.categoyModel = new CategoryModel();
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
      mainCategoryCount,
      subCategoryCount,
      categoryCount,
      data: result,
    };
  };

  private checkDuplicateSub = async (payload: any) => {
    let isChecked = false;
    if (payload.subs) {
      const subCategories = payload.subs.map((subCategory: any) => {
        return subCategory.name;
      });
      isChecked = subCategories.some((subCategory: any, index: number) => {
        return subCategories.indexOf(subCategory) != index;
      });
      if (isChecked) {
        return true;
      }

      const categrories: any[] = [];
      payload.subs.map((item: any) => {
        if (item.subs) {
          item.subs.forEach((element: any) => {
            categrories.push(element.name);
          });
        }
        return undefined;
      });
      isChecked = categrories.some((category: any, idx: number) => {
        return categrories.indexOf(category) != idx;
      });
      if (isChecked) {
        return true;
      }
    }
    return false;
  };

  private getSubCategories = async () => {
    const categories = await this.categoyModel.getAll();
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
      const existedName = await this.categoyModel.findBy({
        name: payload.name.toLowerCase(),
      });
      const isDuplicateSub = await this.checkDuplicateSub(payload);
      if (isDuplicateSub || existedName) {
        return resolve({
          message: MESSAGES.CATEGORY_EXISTED,
          statusCode: 400,
        });
      }

      let subs;
      if (payload.subs) {
        subs = await this.addId(payload);
      }
      const category = await this.categoyModel.create({
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
    filter: any,
    main_category_order: string,
    sub_category_order: any,
    category_order: any
  ): Promise<IMessageResponse | ICategoriesResponse | any> => {
    return new Promise(async (resolve) => {
      const categories = await this.categoyModel.list(limit, offset, filter, [
        "name",
        main_category_order,
      ]);

      let returnedCategory = categories.map((item: ICategoryAttributes) => {
        const newSub = item.subs.map((sub: any) => {
          return {
            ...sub,
          };
        });
        let sortedSubs;
        if (sub_category_order) {
          sortedSubs = sortObjectArray(newSub, "name", sub_category_order);
        }
        if (category_order) {
          sortedSubs = sortObjectArray(newSub, "name", category_order);
        }
        const { is_deleted, ...rest } = {
          ...item,
          subs: sortedSubs,
        };
        return rest;
      });

      const result = this.addCount(returnedCategory);

      return resolve({
        data: {
          categories: result.data,
          main_category_count: result.mainCategoryCount,
          sub_category_count: result.subCategoryCount,
          category_count: result.categoryCount,
        },
        statusCode: 200,
      });
    });
  };

  public get = async (
    id: string
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const result = await this.categoyModel.find(id);
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
      const category = await this.categoyModel.find(id);
      if (!category) {
        return resolve({
          message: MESSAGES.NOT_FOUND,
          statusCode: 404,
        });
      }
      const isExistedNameNotId = await this.categoyModel.foundNameNotId(
        payload.name,
        id
      );
      const isDuplicateSub = await this.checkDuplicateSub(payload);
      if (isExistedNameNotId || isDuplicateSub) {
        return resolve({
          message: MESSAGES.CATEGORY_EXISTED,
          statusCode: 400,
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
      const result = await this.categoyModel.update(id, {
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
      const record = await this.categoyModel.find(id);
      if (!record) {
        return resolve({
          message: MESSAGES.NOT_FOUND,
          statusCode: 404,
        });
      }
      await this.categoyModel.update(id, { is_deleted: true });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
}
