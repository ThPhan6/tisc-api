import { MESSAGES } from "../../constant/common.constant";
import CollectionModel from "../../model/collection.model";
import ProductModel, {
  IProductAttributes,
  PRODUCT_NULL_ATTRIBUTES,
} from "../../model/product.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IProductRequest,
  IProductResponse,
  IProductsResponse,
  IRestCollectionProductItem,
  IRestCollectionProductsResponse,
} from "./product.type";
export default class ProductService {
  private productModel: ProductModel;
  private collectionModel: CollectionModel;
  constructor() {
    this.productModel = new ProductModel();
    this.collectionModel = new CollectionModel();
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
  public getListRestCollectionProduct = (
    productId: string
  ): Promise<IMessageResponse | IRestCollectionProductsResponse> => {
    return new Promise(async (resolve) => {
      const foundProduct = await this.productModel.find(productId);
      if (!foundProduct) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (!foundProduct.collection_id) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const foundCollection = await this.collectionModel.find(
        foundProduct.collection_id
      );
      if (!foundCollection) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const restCollectionProducts =
        await this.productModel.getListRestCollectionProduct(
          foundProduct.collection_id,
          productId
        );
      const result = restCollectionProducts.map(
        (item: IRestCollectionProductItem) => {
          return {
            id: item.id,
            collection_id: item.collection_id,
            name: item.name,
            images: item.images,
            created_at: item.created_at,
          };
        }
      );
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
}
