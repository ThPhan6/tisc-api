import Model from "./index";

export interface IProductAttributes {
  id: string;
  brand_id: string;
  collection_id: string | null;
  category_ids: string[] | null;
  name: string;
  code: string;
  description: string | null;
  general_attribute_ids: string[];
  feature_attribute_ids: string[];
  specification_attribute_ids: string[];
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
  general_attribute_ids: null,
  feature_attribute_ids: null,
  specification_attribute_ids: null,
  favorites: null,
  images: null,
  created_at: null,
  created_by: null,
  is_deleted: false,
};

export default class ProductModel extends Model<IProductAttributes> {
  constructor() {
    super("products");
  }

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
}
