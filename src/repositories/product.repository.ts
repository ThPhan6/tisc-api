import {
  IProductAttributes,
  ProductWithCollectionAndBrand,
} from "@/types/product.type";
import BaseRepository from "./base.repository";
import ProductModel from "@/model/product.models";
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
    favorites: [],
    images: [],
    keywords: [],
    brand_location_id: "",
    distributor_location_id: "",
  };
  constructor() {
    super();
    this.model = new ProductModel();
  }
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

  public getListRestCollectionProduct = async (
    collectionId: string,
    productId: string
  ) => {
    try {
      return this.model
        .whereNotLike("id", productId)
        .where("collection_id", "==", collectionId)
        .select()
        .get();
    } catch (error) {
      return false;
    }
  };

  public getAllByCategoryId = async (
    category_id: string,
    brand_id?: string,
    name?: string
  ): Promise<IProductAttributes[]> => {
    try {
      let result: any = this.model.where(
        "category_ids",
        "==",
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

  public getAllBrandProduct = async (
    brand_id: string
  ): Promise<IProductAttributes[]> => {
    try {
      const result = await this.model
        .where("brand_id", "==", brand_id)
        .select()
        .get();
      return result;
    } catch (error) {
      return [];
    }
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
}

export default ProductRepository;
