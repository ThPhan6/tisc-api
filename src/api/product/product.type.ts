import { IPagination } from "./../../type/common.type";
export interface IProduct {
  id: string;
  name: string;
  created_at: string;
}
export interface IProductRequest {
  brand_id: string;
  collection_id: string;
  category_ids: string[];
  name: string;
  description: string;
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
}
export interface IProductResponse {
  data: IProduct;
  statusCode: number;
}
export interface IProductsResponse {
  data: {
    products: IProduct[];
    pagination: IPagination;
  };
  statusCode: number;
}
