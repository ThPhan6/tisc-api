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
}
