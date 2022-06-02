import { MESSAGES } from "./../../constant/common.constant";
import { IMessageResponse } from "./../../type/common.type";
import { PRODUCT_TYPES } from "../../constant/common.constant";
import CategoryModel, {
  CATEGORY_NULL_ATTRIBUTES,
} from "../../model/category.model";
import {
  ICategoryAttributes,
  ICategoryRequest,
  ICategoryResponse,
} from "./product.type";
export default class ProductService {
  private productModel: CategoryModel;
  constructor() {
    this.productModel = new CategoryModel();
  }

  public createCateogry = async (
    payload: ICategoryRequest
  ): Promise<IMessageResponse | ICategoryResponse> => {
    return new Promise(async (resolve) => {
      const category = await this.productModel.create({
        ...CATEGORY_NULL_ATTRIBUTES,
        type: PRODUCT_TYPES.CATEGORIES,
        name: payload.name,
        parent_id: payload.parent_id || null,
      });
      if (!category) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = category;
      console.log(rest, "[rest]");
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
  ): Promise<IMessageResponse | any> => {
    return new Promise(async (resolve) => {
      const categories = await this.productModel.list(
        limit,
        offset,
        filter,
        sort
      );
      if (!categories) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }

      const mainCategories = categories.filter(
        (category: ICategoryAttributes) => category.parent_id == null
      );
      let listSub = categories.map((category: ICategoryAttributes) => {
        for (let index = 0; index < mainCategories.length; index++) {
          if (category.parent_id == mainCategories[index].id) {
            return category;
          }
        }
      });

      listSub = categories
        .map((category: ICategoryAttributes) => {
          for (let index = 0; index < listSub.length; index++) {
            if (listSub[index] && category.parent_id == listSub[index].id) {
              return {
                ...listSub[index],
                categories: [category],
              };
            }
          }
          return undefined;
        })
        .filter((el: ICategoryAttributes) => el !== undefined);
      const result = categories
        .map((category: ICategoryAttributes) => {
          if (!category.parent_id) {
            return {
              ...category,
              sub_categories: listSub,
            };
          }
          return undefined;
        })
        .filter((el: ICategoryAttributes) => el !== undefined);
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
}
