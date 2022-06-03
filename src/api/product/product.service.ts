import { MESSAGES } from "./../../constant/common.constant";
import { IMessageResponse } from "./../../type/common.type";
import { PRODUCT_TYPES } from "../../constant/common.constant";
import CategoryModel, {
  CATEGORY_NULL_ATTRIBUTES,
} from "../../model/product.model";
import {
  ICategoriesResponse,
  ICategoryAttributes,
  ICategoryRequest,
  ICategoryResponse,
  IItemSubCategory,
} from "./product.type";
const uuid = require("uuid").v4;

export default class ProductService {
  private productModel: CategoryModel;
  constructor() {
    this.productModel = new CategoryModel();
  }

  public createCateogry = async (
    payload: ICategoryRequest
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      let arrSub: any;
      const bodySub = payload.subs.map((item: IItemSubCategory) => {
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
      const category = await this.productModel.create({
        ...CATEGORY_NULL_ATTRIBUTES,
        name: payload.name,
        subs: bodySub,
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
      result = result.map((el: any) => {
        const { is_deleted, ...rest } = el;
        return rest;
      });
      return resolve({
        data: result,
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

  public update = async (
    id: string,
    payload: ICategoryRequest
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const category = await this.productModel.find(id);
      if (!category) {
        return resolve({
          message: MESSAGES.CATEGORY_NOT_FOUND,
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
        id: payload.id,
        name: payload.name,
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
}
