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
  general_attribute_ids: string[];
  feature_attribute_ids: string[];
  specification_attribute_ids: string[];
}
export interface IProductResponse {
  data: IProduct;
  statusCode: number;
}
export interface IProductsResponse {
  data: {
    products: IProduct[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      page_count: number;
    };
  };
  statusCode: number;
}
