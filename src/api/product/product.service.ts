import moment from "moment";
import { v4 as uuid } from "uuid";
import CategoryService from "../../api/category/category.service";
import { MESSAGES, VALID_IMAGE_TYPES } from "../../constant/common.constant";
import {
  getDistinctArray,
  getFileTypeFromBase64,
} from "../../helper/common.helper";
import { toWebp } from "../../helper/image.helper";
import BrandModel from "../../model/brand.model";
import CollectionModel from "../../model/collection.model";
import ProductModel, {
  IProductAttributes,
  PRODUCT_NULL_ATTRIBUTES,
} from "../../model/product.model";
import { deleteFile, isExists, upload } from "../../service/aws.service";
import { IMessageResponse, IPagination } from "../../type/common.type";
import { getBufferFile } from "./../../service/aws.service";
import {
  IBrandProductSummary,
  IProductRequest,
  IProductResponse,
  IProductsResponse,
  IRestCollectionProductsResponse,
  IUpdateProductRequest,
} from "./product.type";

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

      let isValidImage = true;
      for (const image of payload.images) {
        const fileType = await getFileTypeFromBase64(image);
        if (
          !fileType ||
          !VALID_IMAGE_TYPES.find((validType) => validType === fileType.mime)
        ) {
          isValidImage = false;
        }
      }
      if (!isValidImage) {
        return resolve({
          message: MESSAGES.INVALID_IMAGE,
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
        general_attribute_groups: saveGeneralAttributeGroups,
        feature_attribute_groups: saveFeatureAttributeGroups,
        specification_attribute_groups: saveSpecificationAttributeGroups,
        created_by: user_id,
        images: [],
        keywords: payload.keywords,
      });
      if (!createdProduct) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const brand = await this.brandModel.find(payload.brand_id);
      const imagesPath = await Promise.all(
        payload.images.map(async (image, index) => {
          const mediumBuffer = await toWebp(
            Buffer.from(image, "base64"),
            "medium"
          );
          const keyword = payload.keywords.toString().split(",").join("_");
          const brandName = brand?.name.toLowerCase().split(" ").join("-");
          let fileName = `${brandName}_${keyword}_${moment.now()}${index}`;
          await upload(
            mediumBuffer,
            `product/${createdProduct.id}/${fileName}_medium.webp`,
            "image/webp"
          );
          return `/product/${createdProduct.id}/${fileName}_medium.webp`;
        })
      );
      await this.productModel.update(createdProduct.id, {
        images: imagesPath,
      });
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

      let imagesPath: string[] = [];
      let isValidImage = true;
      let mediumBuffer: Buffer;
      if (payload.images.join("-") === product.images.join("-")) {
        imagesPath = product.images;
      } else {
        const bufferImages = await Promise.all(
          payload.images.map(async (image) => {
            const fileType = await getFileTypeFromBase64(image);
            if (!fileType && (await isExists(image.slice(1)))) {
              return await getBufferFile(image.slice(1));
            }
            if (
              (!fileType && !(await isExists(image.slice(1)))) ||
              !VALID_IMAGE_TYPES.find(
                (validType) => validType === fileType.mime
              )
            ) {
              isValidImage = false;
            }
            return Buffer.from(image, "base64");
          })
        );
        if (!isValidImage) {
          return resolve({
            message: MESSAGES.INVALID_IMAGE,
            statusCode: 400,
          });
        }
        product.images.map(async (item) => {
          await deleteFile(item.slice(1));
        });
        imagesPath = await Promise.all(
          bufferImages.map(async (image, index) => {
            mediumBuffer = await toWebp(image, "medium");
            const brand = await this.brandModel.find(product.brand_id);
            const keyword = payload.keywords.toString().split(",").join("_");
            const brandName = brand?.name.toLowerCase().split(" ").join("-");
            let fileName = `${brandName}_${keyword}_${moment.now()}${index}`;
            await upload(
              mediumBuffer,
              `product/${id}/${fileName}_medium.webp`,
              "image/webp"
            );
            return `/product/${id}/${fileName}_medium.webp`;
          })
        );
      }
      const updatedProduct = await this.productModel.update(id, {
        ...payload,
        general_attribute_groups: saveGeneralAttributeGroups,
        feature_attribute_groups: saveFeatureAttributeGroups,
        specification_attribute_groups: saveSpecificationAttributeGroups,
        images: imagesPath,
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
          keywords: product.keywords,
        },
        statusCode: 200,
      });
    });
  public getBrandProductSummary = (
    brand_id: string
  ): Promise<IBrandProductSummary> =>
    new Promise(async (resolve) => {
      const allProduct = await this.productModel.getAllBrandProduct(brand_id);
      const rawCategoryIds = allProduct.reduce(
        (pre: string[], cur: IProductAttributes) => {
          return pre.concat(cur.category_ids || []);
        },
        []
      );

      const rawCollectionIds = allProduct.reduce(
        (pre: string[], cur: IProductAttributes) => {
          return pre.concat(cur.collection_id || "");
        },
        []
      );

      const variants = allProduct.reduce(
        (pre: string[], cur: IProductAttributes) => {
          let temp: any = [];
          cur.specification_attribute_groups.forEach((group) => {
            group.attributes.forEach((attribute) => {
              attribute.bases.forEach((basis) => {
                temp.push(basis);
              });
            });
          });
          return pre.concat(temp);
        },
        []
      );
      const categoryIds = getDistinctArray(rawCategoryIds);
      const collectionIds = getDistinctArray(rawCollectionIds);
      const categories = await this.categoryService.getCategoryValues(
        categoryIds
      );
      const collections: { id: string; name: string }[] =
        await this.collectionModel.getMany(collectionIds, ["id", "name"]);
      return resolve({
        data: {
          categories,
          collections,
          category_count: categories.length,
          collection_count: collections.length,
          card_count: allProduct.length,
          product_count: variants.length,
        },
        statusCode: 200,
      });
    });

  public getList = (
    limit: number,
    offset: number,
    filter?: any,
    sort?: any,
    brand_id?: string
  ): Promise<IMessageResponse | IProductsResponse> => {
    return new Promise(async (resolve) => {
      let products: IProductAttributes[] = [];
      if (filter && filter.category_id) {
        products = await this.productModel.getListByCategoryId(
          filter.category_id,
          limit,
          offset,
          sort,
          brand_id
        );
      } else {
        products = await this.productModel.list(
          limit,
          offset,
          brand_id ? { ...filter, brand_id } : filter,
          sort
        );
      }
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
        return {
          ...item,
          favorites: item.favorites.length,
        };
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

      const result = restCollectionProducts.map((item: IProductAttributes) => {
        return {
          id: item.id,
          collection_id: item.collection_id,
          name: item.name,
          images: item.images,
          created_at: item.created_at,
        };
      });
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public likeOrUnlike = (
    id: string,
    user_id: string
  ): Promise<IMessageResponse> =>
    new Promise(async (resolve) => {
      const product = await this.productModel.find(id);
      if (!product) {
        return resolve({
          message: MESSAGES.NOT_FOUND_PRODUCT,
          statusCode: 404,
        });
      }
      const foundUserId = product.favorites.find((item) => item === user_id);
      let newFavorites: string[] = [];
      if (foundUserId) {
        newFavorites = product.favorites.filter((item) => item !== foundUserId);
      } else {
        newFavorites = product.favorites;
        newFavorites.push(user_id);
      }
      await this.productModel.update(id, {
        favorites: newFavorites,
      });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
}
