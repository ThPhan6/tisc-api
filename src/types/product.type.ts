import { IAttributeGroupWithOptionalId } from "@/api/product/product.type";
import { BrandOfficialWebsite } from "@/types";

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
  images: string[];
  keywords: string[];
  created_at: string;
  created_by: string;
  updated_at: string | null;
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
export interface ProductWithRelationData extends ProductWithCollectionAndBrand {
  categories: {
    id: string;
    name: string;
  }[];
  brand: {
    id: string;
    name: string;
    logo: string;
    official_websites: BrandOfficialWebsite[];
  };
  favorites: number;
  is_liked: boolean;
}
