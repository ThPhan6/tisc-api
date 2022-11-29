import { DimensionAndWeight, LocationPayload } from "@/types";
import { ProductSpecificationSelection } from "../user_product_specification/user_product_specification.model";

// Custom Product
export interface CustomProductBasicAttributes {
  name: string;
  content: string;
}

export interface CustomProductAttributes {
  id: string;
  name: string;
  description: string;
  images: string[];
  attributes: CustomProductBasicAttributes[];
  specifications: CustomProductBasicAttributes[];
  dimension_and_weight: DimensionAndWeight;
  options: {
    id: string;
    title: string;
    use_image: boolean;
    tag: string;
    items: {
      id: string;
      image?: string;
      description: string;
      product_id: string; // text input
    }[];
  }[];
  collection_id: string;
  company_id: string; // custom_resources
  design_id: string;
  created_at: string;
  updated_at: string;
}

export type CustomProductPayload = Omit<
  CustomProductAttributes,
  "id" | "created_at" | "updated_at" | "relation_id"
> & { specification?: ProductSpecificationSelection };

// Custom Resource (Brand/Company & Distributor for Custom Product)
export interface CustomResouceContact {
  first_name: string;
  last_name: string;
  position: string;
  work_email: string;
  work_phone: string;
  work_mobile: string;
}

export enum CustomResouceType {
  Brand,
  Distributor,
}

export interface CustomResouceAttributes {
  id: string;
  type: CustomResouceType;

  website_uri: string;
  location_id: string; // locations
  associate_resource_ids: string[]; // custom_resources
  contacts: CustomResouceContact[];
  design_id: string; // design firm

  created_at: string;
  updated_at: string | null;
}

export interface CustomResourcePayload
  extends Omit<CustomResouceAttributes, "id" | "created_at" | "updated_at">,
    Omit<LocationPayload, "type"> {}

export type GetCustomResourceListSorting = "business_name" | "location";

export interface CustomResourceListItem {
  id: string;
  business_name: string;
  general_email: string;
  general_phone: string;
  phone_code: string;
  location: string;
  contacts: number;
  distributors: number;
  cards: number;
  brands: number;
}
