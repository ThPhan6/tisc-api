import { MESSAGES } from "./../../constant/common.constant";
import { IMessageResponse } from "./../../type/common.type";
import { PRODUCT_TYPES } from "../../constant/common.constant";
import CategoryModel, {
  CATEGORY_NULL_ATTRIBUTES,
} from "../../model/category.model";
import { ICategoryRequest, ICategoryResponse } from "./product.type";
export default class ProductService {
  private productModel: CategoryModel;
  constructor() {
    this.productModel = new CategoryModel();
  }

  public createCateogry = async (
    payload: ICategoryRequest
  ): Promise<IMessageResponse | ICategoryResponse | any> => {
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
    sort: any
  ) => {};
}
