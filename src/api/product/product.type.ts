import { IPagination } from "./../../type/common.type";
export interface IProduct {
  id: string;
  brand: {
    id: string;
    name: string;
  };
  collection: {
    id: string;
    name: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  name: string;
  code: string;
  description: any;
  general_attribute_groups: any;
  feature_attribute_groups: any;
  specification_attribute_groups: any;
  favorites: number;
  images: string[];
  keywords: string[];
  created_at: string;
  created_by: any;
}
export interface IProductRequest {
  brand_id: string;
  collection_id: string;
  category_ids: string[];
  name: string;
  description: string;
  general_attribute_groups: {
    name: string;
    attributes: {
      id: string;
      basis_id: string;
    }[];
  }[];
  feature_attribute_groups: {
    name: string;
    attributes: {
      id: string;
      basis_id: string;
    }[];
  }[];
  specification_attribute_groups: {
    name: string;
    attributes: {
      id: string;
      bases: {
        id: string;
        option_code: string;
      }[];
    }[];
  }[];
  images: string[];
  keywords: string[];
}
export interface IUpdateProductRequest {
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
  images: string[];
  keywords: string[];
}
export interface IProductResponse {
  data: IProduct;
  statusCode: number;
}
export interface IProductsResponse {
  data: any[];
  statusCode: number;
}

export interface IRestCollectionProductsResponse {
  data: {
    id: string;
    collection_id: string;
    name: string;
    images: string[];
    created_at: string;
  }[];
  statusCode: number;
}

export interface IBrandProductSummary {
  data: {
    categories: {
      id: string;
      name: string;
    }[];
    collections: {
      id: string;
      name: string;
    }[];
    category_count: number;
    collection_count: number;
    card_count: number;
    product_count: number;
  };
  statusCode: number;
}
