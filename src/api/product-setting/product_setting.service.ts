import { MESSAGES } from "../../constant/common.constant";
import { IMessageResponse } from "../../type/common.type";
import { PRODUCT_TYPES } from "../../constant/common.constant";
import ProductSettingModel, {
  CATEGORY_NULL_ATTRIBUTES,
} from "../../model/category_basis_attribute.model";
import {
  ICategoriesResponse,
  IProductSettingResponse,
  IItemSubCategory,
  IProductSettingRequest,
  IProductSettingAttributes,
  ICategoryResponse,
} from "./product_setting.type";
const uuid = require("uuid").v4;

export default class ProductService {
  private productModel: ProductSettingModel;
  constructor() {
    this.productModel = new ProductSettingModel();
  }

  private cleanData = async (payload: IProductSettingRequest) => {
    let arrSub: any;
    const subs = payload.subs.map((item: IItemSubCategory) => {
      if (item.subs) {
        arrSub = item.subs.map((el: IItemSubCategory) => {
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
        subs: arrSub,
      };
    });
    return subs;
  };

  public createCateogry = async (
    payload: IProductSettingRequest
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const categoryExisted = await this.productModel.findBy({
        name: payload.name.toLowerCase(),
        type: PRODUCT_TYPES.CATEGORIES,
      });
      if (categoryExisted) {
        return resolve({
          message: MESSAGES.CATEGORY_EXISTED,
          statusCode: 400,
        });
      }
      let subs;
      if (payload.subs) {
        subs = await this.cleanData(payload);
      }
      const category = await this.productModel.create({
        ...CATEGORY_NULL_ATTRIBUTES,
        name: payload.name,
        subs,
        type: PRODUCT_TYPES.CATEGORIES,
      });
      if (!category) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = category;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getCategories = async (
    limit: number,
    offset: number,
    filter: any,
    sort: string
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
      result = result.map((item: IProductSettingAttributes) => {
        const { type, is_deleted, ...rest } = item;
        if (item.subs) {
          const result2 = item.subs.map((el: IProductSettingAttributes) => {
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
            subs: result2,
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
          mainCategoryCount,
          subCategoryCount,
          categoryCount,
        },
        statusCode: 200,
      });
    });
  };

  public getById = async (
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
      const { type, is_deleted, ...rest } = result;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public updateProductSetting = async (
    id: string,
    payload: IProductSettingRequest
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const category = await this.productModel.find(id);
      if (!category) {
        return resolve({
          message: MESSAGES.NOT_FOUND,
          statusCode: 404,
        });
      }
      let body;
      if (payload.subs) {
        let subs: any;
        body = payload.subs.map((item: any) => {
          if (item.subs) {
            subs = item.subs.map((subItem: any) => {
              if (!subItem.id) {
                return {
                  id: uuid(),
                  ...subItem,
                };
              }
              return {
                ...subItem,
              };
            });
          }
          if (!item.id) {
            return {
              id: uuid(),
              ...item,
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
        subs: body,
      });
      if (!result) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }

      const { type, is_deleted, ...rest } = result;
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
