import { IAttributeGroupHasId } from "../api/product/product.type";
import Model from "./index";
import { removeUnnecessaryArangoFields } from "../query_builder";
export interface IProductAttributes {
  id: string;
  brand_id: string;
  collection_id: string | null;
  category_ids: string[];
  name: string;
  code: string;
  description: string | null;
  general_attribute_groups: IAttributeGroupHasId[];
  feature_attribute_groups: IAttributeGroupHasId[];
  specification_attribute_groups: IAttributeGroupHasId[];
  favorites: string[];
  images: string[];
  keywords: string[];
  brand_location_id: string;
  distributor_location_id: string;
  created_at: string;
  created_by: string;
  is_deleted: boolean;
}

export const PRODUCT_NULL_ATTRIBUTES = {
  id: null,
  brand_id: null,
  collection_id: null,
  category_ids: [],
  name: null,
  code: null,
  description: null,
  general_attribute_groups: null,
  feature_attribute_groups: null,
  specification_attribute_groups: null,
  favorites: [],
  images: [],
  keywords: [],
  brand_location_id: null,
  distributor_location_id: null,
  created_at: null,
  created_by: null,
  is_deleted: false,
};

export default class ProductModel extends Model<IProductAttributes> {
  constructor() {
    super("products");
  }
  public getDuplicatedProduct = async (
    id: string,
    name: string,
    brand_id: string
  ) => {
    try {
      const result: any = await this.getBuilder()
        .builder.whereNot("id", id)
        .whereNot("is_deleted", true)
        .where("brand_id", brand_id)
        .where("name", name.toLowerCase())
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
      const result: any = await this.getBuilder()
        .builder.whereNot("id", productId)
        .whereNot("is_deleted", true)
        .where("collection_id", collectionId)
        .orderBy("created_at", "ASC")
        .select();
      return result;
    } catch (error) {
      return false;
    }
  };
  public getListByCategoryId = async (
    category_id: string,
    limit: number,
    offset: number,
    sort?: any,
    brand_id?: string
  ) => {
    try {
      let result: IProductAttributes[] = [];
      if (brand_id) {
        if (sort) {
          result = await this.getBuilder()
            .builder.whereNot("is_deleted", true)
            .where("brand_id", brand_id)
            .whereInRevert("category_ids", category_id)
            .orderBy(sort[0], sort[1])
            .paginate(limit, offset)
            .select();
        } else {
          result = await this.getBuilder()
            .builder.whereNot("is_deleted", true)
            .where("brand_id", brand_id)
            .whereInRevert("category_ids", category_id)
            .orderBy("created_at", "ASC")
            .paginate(limit, offset)
            .select();
        }
      } else {
        if (sort) {
          result = await this.getBuilder()
            .builder.whereNot("is_deleted", true)
            .whereInRevert("category_ids", category_id)
            .orderBy(sort[0], sort[1])
            .paginate(limit, offset)
            .select();
        } else {
          result = await this.getBuilder()
            .builder.whereNot("is_deleted", true)
            .whereInRevert("category_ids", category_id)
            .orderBy("created_at", "ASC")
            .paginate(limit, offset)
            .select();
        }
      }
      return result;
    } catch (error) {
      return [];
    }
  };
  public getAllByCategoryId = async (
    category_id: string,
    brand_id?: string,
    name?: string
  ): Promise<IProductAttributes[]> => {
    try {
      let result: any = this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereInRevert("category_ids", category_id);
      if (brand_id) {
        result = result.where("brand_id", brand_id);
      }
      if (name) {
        result = result.whereLike("name", name);
      }
      result = await result.orderBy("created_at", "DESC").select();
      return result as IProductAttributes[];
    } catch (error) {
      return [];
    }
  };
  public getAllBrandProduct = async (
    brand_id: string
  ): Promise<IProductAttributes[]> => {
    try {
      const result = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where("brand_id", brand_id)
        .orderBy("created_at", "ASC")
        .select();
      return result;
    } catch (error) {
      return [];
    }
  };
  public getAllByAndNameLike = async (
    params: any,
    keys?: string[],
    sort?: string,
    order?: "ASC" | "DESC",
    name?: string
  ): Promise<IProductAttributes[]> => {
    try {
      let result: any = this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where(params);
      if (sort && order) {
        result = result.orderBy(sort, order);
      }
      if (name) {
        result = result.whereLike("name", name);
      }
      result = await result.select(keys);
      return result as IProductAttributes[];
    } catch (error) {
      return [];
    }
  };
  public getAllByAndNameLikeAndCategory = async (
    params: any,
    category_id: string,
    keys?: string[],
    sort?: string,
    order?: "ASC" | "DESC",
    name?: string
  ): Promise<IProductAttributes[]> => {
    try {
      let result: any = this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where(params)
        .whereInRevert("category_ids", category_id);
      if (sort && order) {
        result = result.orderBy(sort, order);
      }
      if (name) {
        result = result.whereLike("name", name);
      }
      result = await result.select(keys);
      return result as IProductAttributes[];
    } catch (error) {
      return [];
    }
  };

  public getUserFavouriteProducts = async (
    userId: string,
    order?: "ASC" | "DESC",
    brandId?: string,
    categoryId?: string
  ): Promise<IProductAttributes[]> => {
    const params = { userId } as any;
    let rawQuery = `
      FOR data IN products
        FOR userId IN data.favorites
          FILTER userId == @userId
    `;
    if (brandId) {
      rawQuery += ` FILTER data.brand_id == @brandId `;
      params.brandId = brandId;
    }
    if (categoryId) {
      rawQuery += ` FOR categoryId IN data.category_ids
        FILTER categoryId == @categoryId `;
      params.categoryId = categoryId;
    }

    rawQuery += ` SORT data.name ${order} return data`;
    let result: any = await this.getBuilder().raw(rawQuery, params);

    if (result === false) {
      return [];
    }
    return result._result.map((product: IProductAttributes) => {
      return removeUnnecessaryArangoFields(product);
    }) as IProductAttributes[];
  };
}
