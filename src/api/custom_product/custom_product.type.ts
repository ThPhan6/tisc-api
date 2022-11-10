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
  created_at: string;
  updated_at: string;
}
