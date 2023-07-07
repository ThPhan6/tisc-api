import BaseRepository from "./base.repository";
import ProductModel from "@/models/product.model";
import { head, isUndefined } from "lodash";
import {
  SortOrder,
  IProductAttributes,
  ProductWithCollectionAndBrand,
  ProductWithRelationData,
} from "@/types";

class ProductRepository extends BaseRepository<IProductAttributes> {
  protected model: ProductModel;
  protected DEFAULT_ATTRIBUTE: Partial<IProductAttributes> = {
    id: "",
    brand_id: "",
    collection_ids: [],
    category_ids: [],
    name: "",
    code: "",
    description: "",
    general_attribute_groups: [],
    feature_attribute_groups: [],
    specification_attribute_groups: [],
    images: [],
    keywords: [],
    created_by: "",
    tips: [],
    downloads: [],
    catelogue_downloads: [],
    detected_color_images: [],
  };
  constructor() {
    super();
    this.model = new ProductModel();
  }

  private getProductQuery = (options: {
    productId?: string;
    brandId?: string;
    collectionId?: string;
    categoryId?: string;
    withFavourite?: boolean;
    filterLiked?: boolean;
    keyword?: string;
    sortName?: string;
    sortOrder?: SortOrder;
    has_color?: boolean;
    limit?: number;
    offset?: number;
    isCount?: boolean;
  }) => {
    const {
      filterLiked = false,
      withFavourite = true,
      brandId,
      categoryId,
      collectionId,
      productId,
      keyword,
      sortName,
      sortOrder,
      limit,
      offset,
    } = options;
    return `
      ${categoryId ? ` FILTER @categoryId IN products.category_ids` : ""}
      ${productId ? ` filter products.id == @productId ` : ""}
      filter products.deleted_at == null
      ${
        keyword
          ? ` FILTER LOWER(products.name) like LOWER(concat('%',@keyword, '%')) `
          : ""
      }
      ${sortName && sortOrder ? ` SORT products.${sortName} ${sortOrder} ` : ""}
      ${limit ? `LIMIT ${offset}, ${limit}` : ""}
      let categories = (
          for mainCategory in categories
          FILTER mainCategory.deleted_at == null
              for subCategory in mainCategory.subs
                  for category in subCategory.subs
                      FILTER category.id in products.category_ids
                      ${categoryId ? ` FILTER category.id == @categoryId` : ""}
          return category
      )
      let collections = (
        for collections in collections
        filter collections.id in products.collection_ids
        return {
          id: collections.id,
          name: collections.name,
          description: collections.description
        }
      )
      for brand in brands
          filter brand.id == products.brand_id
          filter brand.deleted_at == null
          ${brandId ? `filter brand.id == @brandId` : ""}

      
          ${
            collectionId
              ? `for collection in collections
          filter collection.id in products.collection_ids
          filter collection.deleted_at == null
          filter collection.id == @collectionId`
              : ""
          }
          
      let favourite = (
          for product_favourite in product_favourites
          FILTER product_favourite.deleted_at == null
              filter product_favourite.product_id == products.id
          COLLECT WITH COUNT INTO length RETURN length
      )
      let liked = (
        for product_favourite in product_favourites
        FILTER product_favourite.deleted_at == null
        filter product_favourite.product_id == products.id
        ${withFavourite ? `filter product_favourite.created_by == @userId` : ""}
        COLLECT WITH COUNT INTO length RETURN length
      )
      ${filterLiked ? `filter liked[0] > 0` : ""}
      ${
        options.isCount
          ? "COLLECT WITH COUNT INTO length RETURN length"
          : ` RETURN MERGE(
        UNSET(products, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by' ${
          !options.has_color ? ",'detected_color_images'" : ""
        }]), {
        categories: categories,
        
        ${
          collectionId
            ? `collection: {
              id: collection.id,
              name: collection.name
          },`
            : ""
        }
        collections: collections,
        brand: KEEP(brand, 'id','name','logo','official_websites','slogan','mission_n_vision'),
        favorites: favourite[0],
        is_liked: liked[0] > 0
      }
    )`
      }
     `;
  };

  public async findWithRelationData(productId: string, userId?: string) {
    const params = { productId } as any;
    if (!isUndefined(userId)) {
      params.userId = userId;
    }
    const res = (await this.model.rawQuery(
      this.getProductQuery({
        productId,
        withFavourite: !isUndefined(userId),
        has_color: true,
      }),
      params
    )) as ProductWithRelationData[];
    return head(res);
  }

  public async getProductBy(
    userId?: string,
    brandId?: string,
    categoryId?: string,
    collectionId?: string,
    keyword?: string,
    sort?: string,
    order: SortOrder = "DESC",
    likedOnly: boolean = false,
    limit?: number,
    offset?: number
  ): Promise<ProductWithRelationData[]> {
    const params = {
      userId,
      brandId,
      categoryId,
      collectionId,
      keyword,
    };

    return this.model.rawQuery(
      this.getProductQuery({
        brandId,
        collectionId,
        categoryId,
        withFavourite: !isUndefined(userId),
        filterLiked: likedOnly,
        keyword,
        sortName: sort || "created_at",
        sortOrder: order,
        limit,
        offset,
      }),
      params
    );
  }
  public async countProductBy(
    userId?: string,
    brandId?: string,
    categoryId?: string,
    collectionId?: string,
    keyword?: string,
    sort?: string,
    order: SortOrder = "DESC",
    likedOnly: boolean = false,
    limit?: number,
    offset?: number
  ): Promise<number[]> {
    const params = {
      userId,
      brandId,
      categoryId,
      collectionId,
      keyword,
    };

    return this.model.rawQuery(
      this.getProductQuery({
        brandId,
        collectionId,
        categoryId,
        withFavourite: !isUndefined(userId),
        filterLiked: likedOnly,
        keyword,
        sortName: sort || "created_at",
        sortOrder: order,
        limit,
        offset,
        isCount: true,
      }),
      params
    );
  }

  public getFavouriteProducts = (
    userId: string,
    brandId?: string,
    categoryId?: string,
    order?: SortOrder
  ) => {
    return this.getProductBy(
      userId,
      brandId,
      categoryId,
      undefined,
      undefined,
      order ? "name" : undefined,
      order,
      true
    );
  };

  public getDuplicatedProduct = async (
    id: string,
    name: string,
    brand_id: string
  ) => {
    try {
      const result: any = await this.model
        .whereNotLike("id", id)
        .where("brand_id", "==", brand_id)
        .where("name", "==", name.toLowerCase())
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };

  public getRelatedCollection = async (
    productId: string,
    collectionIds: string[]
  ) => {
    return (await this.model
      .where("id", "!=", productId)
      .where("collection_id", "in", collectionIds)
      .get()) as IProductAttributes[];
  };

  public getAllByCategoryId = async (
    category_id: string,
    brand_id?: string,
    name?: string
  ): Promise<IProductAttributes[]> => {
    try {
      let result: any = this.model.where(
        "category_ids",
        "in",
        category_id,
        "inverse"
      );

      if (brand_id) {
        result = result.where("brand_id", "==", brand_id);
      }
      if (name) {
        result = result.whereLike("name", name);
      }
      result = await result.order("created_at", "DESC").select().get();

      return result as IProductAttributes[];
    } catch (error) {
      return [];
    }
  };

  public getAllBrandProduct = async (brandId: string) => {
    return (await this.model.rawQuery(
      this.getProductQuery({ brandId, withFavourite: false }),
      { brandId }
    )) as ProductWithRelationData[];
  };

  public getUserFavouriteProducts = async (
    userId: string,
    order: SortOrder = "ASC",
    brandId?: string,
    categoryId?: string
  ): Promise<ProductWithCollectionAndBrand[]> => {
    const params = { userId } as any;
    let rawQuery = `
        FILTER products.deleted_at == null
        FOR userId IN products.favorites
          FILTER userId == @userId
    `;
    if (brandId) {
      rawQuery += ` FILTER products.brand_id == @brandId `;
      params.brandId = brandId;
    }
    if (categoryId) {
      rawQuery += ` FOR categoryId IN products.category_ids
        FILTER categoryId == @categoryId `;
      params.categoryId = categoryId;
    }

    /// join brands
    rawQuery += ` FOR brand IN brands
      FILTER products.brand_id == brand.id
      FILTER brand.deleted_at == null
      FOR collection IN collections
      FILTER collection.deleted_at == null
      FILTER products.collection_id == collection.id
      SORT products.name ${order}
      RETURN merge(products, {
        brand: {
          id: brand.id,
          name: brand.name,
          logo: brand.logo
        },
        collection: {
          id: collection.id,
          name: collection.name
        }
      })
    `;

    let result = await this.model.rawQuery(rawQuery, params);

    if (result === false) {
      return [];
    }
    return result._result as ProductWithCollectionAndBrand[];
  };

  public getCustomList = async (
    keyword?: string,
    sort_name?: string,
    sort_order: SortOrder = "ASC",
    brandId?: string,
    categoryId?: string
  ): Promise<ProductWithCollectionAndBrand[]> => {
    const params = {} as any;
    let rawQuery = ` FILTER products.deleted_at == null `;
    if (brandId) {
      rawQuery += ` FILTER products.brand_id == @brandId `;
      params.brandId = brandId;
    }
    if (categoryId) {
      rawQuery += ` FOR categoryId IN products.category_ids
        FILTER categoryId == @categoryId `;
      params.categoryId = categoryId;
    }
    if (keyword) {
      rawQuery += ` FILTER LOWER(products.name) like LOWER(concat('%',@keyword, '%')) `;
      params.keyword = keyword.toLowerCase();
    }
    if (sort_name && sort_order) {
      rawQuery += ` SORT products.${sort_name} ${sort_order} `;
    }
    /// join brands
    rawQuery += ` FOR brand IN brands
      FILTER brand.deleted_at == null
      FILTER products.brand_id == brand.id
      FOR collection IN collections
      FILTER collection.deleted_at == null
      FILTER products.collection_id == collection.id
      RETURN merge(products, {
        brand: {
          id: brand.id,
          name: brand.name,
          logo: brand.logo
        },
        collection: {
          id: collection.id,
          name: collection.name
        }
      })
    `;
    let result = await this.model.rawQuery(rawQuery, params);
    if (result === false) {
      return [];
    }
    return result._result as ProductWithCollectionAndBrand[];
  };

  public async getProductByBrand(brandId: string) {
    const result: IProductAttributes[] = await this.model
      .select()
      .where("brand_id", "==", brandId)
      .get();
    if (!result) {
      return [];
    }
    return result;
  }
}

export default new ProductRepository();
export const productRepository = new ProductRepository();
