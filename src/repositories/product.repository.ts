import {
  IProductAttributes,
  ProductWithCollectionAndBrand,
  ProductWithRelationData,
} from "@/types/product.type";
import BaseRepository from "./base.repository";
import ProductModel from "@/model/product.models";
import { head, isUndefined } from "lodash";

class ProductRepository extends BaseRepository<IProductAttributes> {
  protected model: ProductModel;
  protected DEFAULT_ATTRIBUTE: Partial<IProductAttributes> = {
    id: "",
    brand_id: "",
    collection_id: "",
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
  };
  constructor() {
    super();
    this.model = new ProductModel();
  }

  private getProductQuery = (
    filterProductId?: string,
    filterBrandId?: string,
    filterCollectionId?: string,
    filterCategoryId?: string,
    withFavourite: boolean = true,
    filterLiked: boolean = false,
    keyword?: string,
    sortName?: string,
    sortOrder?: "ASC" | "DESC"
  ) => {
    return `
          ${
            filterCategoryId
              ? ` for cat_id in products.category_ids filter cat_id == @categoryId `
              : ``
          }
          ${filterProductId ? ` filter products.id == @productId ` : ``}
          filter products.deleted_at == null
          ${
            keyword
              ? ` FILTER LOWER(products.name) like concat('%',@keyword, '%') `
              : ``
          }
          ${
            sortName && sortOrder
              ? ` SORT products.${sortName} ${sortOrder} `
              : ``
          }
          let categories = (
              for mainCategory in categories
                  for subCategory in mainCategory.subs
                      for category in subCategory.subs
                          for categoryId in products.category_ids
                          filter categoryId == category.id
              return category
          )
          for brand in brands
              filter brand.id == products.brand_id
              filter brand.deleted_at == null
              ${filterBrandId ? `filter brand.id == @brandId` : ``}
          for collection in collections
              filter collection.id == products.collection_id
              filter collection.deleted_at == null
              ${
                filterCollectionId
                  ? `filter collection.id == @collectionId`
                  : ``
              }
          let favourite = (
              for product_favourite in product_favourites
                  filter product_favourite.product_id == products.id
              COLLECT WITH COUNT INTO length RETURN length
          )
          let liked = (
              for product_favourite in product_favourites
                  filter product_favourite.product_id == products.id
                  ${
                    withFavourite
                      ? `filter product_favourite.created_by == @userId`
                      : ``
                  }
              COLLECT WITH COUNT INTO length RETURN length
          )
          ${filterLiked ? `filter liked[0] > 0` : ``}
          return MERGE(UNSET(products, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by']), {
            categories: categories,
            collection: {
                id: collection.id,
                name: collection.name
            },
            brand: {
                id: brand.id,
                name: brand.name,
                logo: brand.logo,
                official_websites: brand.official_websites
            },
            favorites: favourite[0],
            is_liked: liked[0] > 0
          }
      )`;
  };

  public async findWithRelationData(productId: string, userId?: string) {
    const params = { productId } as any;
    if (!isUndefined(userId)) {
      params.userId = userId;
    }
    const res = (await this.model.rawQuery(
      this.getProductQuery(
        productId,
        undefined,
        undefined,
        undefined,
        !isUndefined(userId)
      ),
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
    order: "ASC" | "DESC" = "ASC",
    likedOnly: boolean = false
  ) {
    //
    const params = {} as any;
    if (userId) {
      params.userId = userId;
    }
    if (brandId) {
      params.brandId = brandId;
    }
    if (categoryId) {
      params.categoryId = categoryId;
    }
    if (collectionId) {
      params.collectionId = collectionId;
    }
    //
    return (await this.model.rawQuery(
      this.getProductQuery(
        undefined,
        brandId,
        collectionId,
        categoryId,
        !isUndefined(userId),
        likedOnly,
        keyword,
        sort,
        order
      ),
      params
    )) as ProductWithRelationData[];
  }

  public getFavouriteProducts = (
    userId: string,
    brandId?: string,
    order?: "ASC" | "DESC"
  ) => {
    return this.getProductBy(
      userId,
      brandId,
      undefined,
      undefined,
      undefined,
      isUndefined(order) ? undefined : "name",
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
    collectionId: string
  ) => {
    return (await this.model
      .where("id", "!=", productId)
      .where("collection_id", "==", collectionId)
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
      this.getProductQuery(undefined, brandId, undefined, undefined, false),
      { brandId }
    )) as ProductWithRelationData[];
  };

  public getUserFavouriteProducts = async (
    userId: string,
    order: "ASC" | "DESC" = "ASC",
    brandId?: string,
    categoryId?: string
  ): Promise<ProductWithCollectionAndBrand[]> => {
    const params = { userId } as any;
    let rawQuery = `
        FILTER products.is_deleted == false
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
    sort_order: "ASC" | "DESC" = "ASC",
    brandId?: string,
    categoryId?: string
  ): Promise<ProductWithCollectionAndBrand[]> => {
    const params = {} as any;
    let rawQuery = ` FILTER products.is_deleted == false `;
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
      rawQuery += ` FILTER LOWER(products.name) like concat('%',@keyword, '%') `;
      params.keyword = keyword.toLowerCase();
    }
    if (sort_name && sort_order) {
      rawQuery += ` SORT products.${sort_name} ${sort_order} `;
    }
    /// join brands
    rawQuery += ` FOR brand IN brands
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
