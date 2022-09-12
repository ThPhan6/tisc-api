import { IAttributeGroupWithOptionalId } from "@/api/product/product.type";

export interface IProductAttributes {
  id: string;
  brand_id: string;
  collection_id: string;
  category_ids: string[];
  name: string;
  code: string;
  description: string;
  general_attribute_groups: IAttributeGroupWithOptionalId[];
  feature_attribute_groups: IAttributeGroupWithOptionalId[];
  specification_attribute_groups: IAttributeGroupWithOptionalId[];
  favorites: string[];
  images: string[];
  keywords: string[];
  brand_location_id: string;
  distributor_location_id: string;
  created_at: string;
  created_by: string;
  is_deleted: boolean;
}

export interface ProductWithCollectionAndBrand extends IProductAttributes {
  collection: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
    logo: string;
  };
}
