import Model from "./index";

export interface IProductAttributes {
  id: string;
  brand_id: string;
  collection_id: string | null;
  category_ids: string[] | null;
  name: string;
  code: string;
  description: string | null;
  general_attribute_groups: {
    id: string;
    name: string;
    attributes: {
      id: string;
      basis_id: string;
    }[];
  }[];
  feature_attribute_groups: {
    id: string;
    name: string;
    attributes: {
      id: string;
      basis_id: string;
    }[];
  }[];
  specification_attribute_groups: {
    id: string;
    name: string;
    attributes: {
      id: string;
      bases: {
        id: string;
        option_code: string;
      }[];
    }[];
  }[];
  favorites: string[] | null;
  images: string[] | null;
  created_at: string;
  created_by: string;
  is_deleted: boolean;
}

export const PRODUCT_NULL_ATTRIBUTES = {
  id: null,
  brand_id: null,
  collection_id: null,
  category_ids: null,
  name: null,
  code: null,
  description: null,
  general_attribute_groups: null,
  feature_attribute_groups: null,
  specification_attribute_groups: null,
  favorites: [],
  images: null,
  created_at: null,
  created_by: null,
  is_deleted: false,
};

export default class ProductModel extends Model<IProductAttributes> {
  constructor() {
    super("products");
  }
  public getDuplicatedProduct = async (id: string, name: string) => {
    try {
      const result: any = await this.builder
        .whereNot("id", id)
        .whereNot("is_deleted", true)
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
      const result: any = await this.builder
        .whereNot("id", productId)
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
          result = await this.builder
            .whereNot("is_deleted", true)
            .where("brand_id", brand_id)
            .whereInRevert("category_ids", category_id)
            .orderBy(sort[0], sort[1])
            .paginate(limit, offset)
            .select();
        } else {
          result = await this.builder
            .whereNot("is_deleted", true)
            .where("brand_id", brand_id)
            .whereInRevert("category_ids", category_id)
            .orderBy("created_at", "ASC")
            .paginate(limit, offset)
            .select();
        }
      } else {
        if (sort) {
          result = await this.builder
            .whereNot("is_deleted", true)
            .whereInRevert("category_ids", category_id)
            .orderBy(sort[0], sort[1])
            .paginate(limit, offset)
            .select();
        } else {
          result = await this.builder
            .whereNot("is_deleted", true)
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
  public getAllBrandProduct = async (
    brand_id: string
  ): Promise<IProductAttributes[]> => {
    try {
      const result = await this.getBuilder()
        .builder.where("brand_id", brand_id)
        .orderBy("created_at", "ASC")
        .select();
      return result;
    } catch (error) {
      return [];
    }
  };
}
