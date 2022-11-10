import { LocationPayload } from "@/types";

// Custom Product
export interface CustomProductBasicAttribute {
  name: string;
  content: string;
}

export interface CustomProductAttribute {
  id: string;
  name: string;
  description: string;
  images: string[];
  attributes: CustomProductBasicAttribute[];
  specification: CustomProductBasicAttribute[];
  options: {
    title: string;
    use_image: boolean;
    tag: string;
    items: {
      image?: string;
      description: string;
      product_id: string; // text input
    }[];
  }[];
  collection_id: string;
  company_id: string; // custom_resources
  relation_id: string;
  created_at: string;
  updated_at: string;
}

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

export interface CustomResouceAttribute {
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
  extends Omit<CustomResouceAttribute, "id" | "created_at" | "updated_at">,
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
