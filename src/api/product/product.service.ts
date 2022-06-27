import { MESSAGES } from "../../constant/common.constant";
import ProductModel, {
  PRODUCT_NULL_ATTRIBUTES,
  IProductAttributes,
} from "../../model/product.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IProductRequest,
  IProductResponse,
  IProductsResponse,
} from "./product.type";

export default class ProductService {
  private productModel: ProductModel;
  constructor() {
    this.productModel = new ProductModel();
  }
  public create = (
    user_id: string,
    payload: IProductRequest
  ): Promise<IMessageResponse | IProductResponse> => {
    return new Promise(async (resolve) => {
      const product = await this.productModel.findBy({
        name: payload.name,
        brand_id: payload.brand_id,
      });
      if (product) {
        return resolve({
          message: MESSAGES.PRODUCT_EXISTED,
          statusCode: 400,
        });
      }
      const createdProduct = await this.productModel.create({
        ...PRODUCT_NULL_ATTRIBUTES,
        brand_id: payload.brand_id,
        collection_id: payload.collection_id,
        category_ids: payload.category_ids,
        name: payload.name,
        code: "random",
        description: payload.description,
        general_attribute_ids: payload.general_attribute_ids,
        feature_attribute_ids: payload.feature_attribute_ids,
        specification_attribute_ids: payload.specification_attribute_ids,
        created_by: user_id,
      });
      if (!createdProduct) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...result } = createdProduct;
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public getList = (
    limit: number,
    offset: number,
    filter?: any,
    sort?: any
  ): Promise<IMessageResponse | IProductsResponse> => {
    return new Promise(async (resolve) => {
      const products: IProductAttributes[] = await this.productModel.list(
        limit,
        offset,
        filter,
        sort
      );
      const pagination: IPagination = await this.productModel.getPagination(
        limit,
        offset
      );
      if (!products) {
        return resolve({
          data: {
            products: [],
            pagination,
          },
          statusCode: 200,
        });
      }
      const result = products.map((product: IProductAttributes) => {
        const { is_deleted, ...item } = product;
        return item;
      });

      return resolve({
        data: {
          products: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  };
}
