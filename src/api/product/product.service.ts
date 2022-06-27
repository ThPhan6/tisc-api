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
  IUpdateProductRequest,
} from "./product.type";
import { v4 as uuid } from "uuid";
import BrandModel from "../../model/brand.model";
import CollectionModel from "../../model/collection.model";
import CategoryService from "../../api/category/category.service";

export default class ProductService {
  private productModel: ProductModel;
  private brandModel: BrandModel;
  private collectionModel: CollectionModel;
  private categoryService: CategoryService;
  constructor() {
    this.productModel = new ProductModel();
    this.brandModel = new BrandModel();
    this.collectionModel = new CollectionModel();
    this.categoryService = new CategoryService();
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
      const mapAttributeFunction = (item: any) => ({
        ...item,
        id: uuid(),
      });
      const saveGeneralAttributeGroups =
        payload.general_attribute_groups.map(mapAttributeFunction);
      const saveFeatureAttributeGroups =
        payload.feature_attribute_groups.map(mapAttributeFunction);
      const saveSpecificationAttributeGroups =
        payload.specification_attribute_groups.map(mapAttributeFunction);
      const createdProduct = await this.productModel.create({
        ...PRODUCT_NULL_ATTRIBUTES,
        brand_id: payload.brand_id,
        collection_id: payload.collection_id,
        category_ids: payload.category_ids,
        name: payload.name,
        code: "random",
        description: payload.description,
        general_attribute_groups: saveGeneralAttributeGroups,
        feature_attribute_groups: saveFeatureAttributeGroups,
        specification_attribute_groups: saveSpecificationAttributeGroups,
        created_by: user_id,
      });
      if (!createdProduct) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }

      return resolve(this.get(createdProduct.id));
    });
  };
  public update = (
    id: string,
    payload: IUpdateProductRequest
  ): Promise<IMessageResponse | IProductResponse> => {
    return new Promise(async (resolve) => {
      const product = await this.productModel.find(id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const duplicatedProduct = await this.productModel.getDuplicatedProduct(
        id,
        payload.name
      );
      if (duplicatedProduct) {
        return resolve({
          message: MESSAGES.DUPLICATED_PRODUCT,
          statusCode: 400,
        });
      }
      const mapAttributeFunction = (item: any) => {
        if (item.id) {
          return item;
        }
        return {
          ...item,
          id: uuid(),
        };
      };
      const saveGeneralAttributeGroups =
        payload.general_attribute_groups.map(mapAttributeFunction);
      const saveFeatureAttributeGroups =
        payload.feature_attribute_groups.map(mapAttributeFunction);
      const saveSpecificationAttributeGroups =
        payload.specification_attribute_groups.map(mapAttributeFunction);
      const updatedProduct = await this.productModel.update(id, {
        ...payload,
        general_attribute_groups: saveGeneralAttributeGroups,
        feature_attribute_groups: saveFeatureAttributeGroups,
        specification_attribute_groups: saveSpecificationAttributeGroups,
      });
      if (!updatedProduct) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }

      return resolve(this.get(id));
    });
  };
  public get = (id: string): Promise<IMessageResponse | IProductResponse> =>
    new Promise(async (resolve) => {
      const product = await this.productModel.find(id);
      if (!product) {
        return resolve({
          message: MESSAGES.NOT_FOUND_PRODUCT,
          statusCode: 404,
        });
      }
      const brand = await this.brandModel.find(product.brand_id);

      const collection = await this.collectionModel.find(
        product.collection_id || ""
      );
      const categories: { id: string; name: string }[] =
        await this.categoryService.getCategoryValues(
          product.category_ids || []
        );
      return resolve({
        data: {
          id: product.id,
          brand: {
            id: brand?.id || product.brand_id,
            name: brand?.name || "",
          },
          collection: {
            id: collection?.id || "",
            name: collection?.name || "",
          },
          categories: categories,
          name: product.name,
          code: product.code,
          description: product.description,
          general_attribute_groups: product.general_attribute_groups,
          feature_attribute_groups: product.feature_attribute_groups,
          specification_attribute_groups:
            product.specification_attribute_groups,
          created_at: product.created_at,
          created_by: product.created_by,
          favorites: product.favorites?.length || 0,
          images: product.images,
        },
        statusCode: 200,
      });
    });
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

  public delete = async (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const product = await this.productModel.find(id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
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
