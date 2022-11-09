export enum CustomLibraryCompanyType {
  Brand,
  Distributor
}

export type CustomLibraryCompanyTypeValue = 0 | 1;

export interface CustomLibraryBasicAttribute {
  name: string;
  content: string;
}

export interface CustomLibraryVendorContact {
  first_name: string;
  last_name: string;
  position: string;
  work_email: string;
  work_phone: string;
  work_mobile: string;
}

export interface CustomLibraryCompanyAttribute {
  id: string;
  website_uri: string;
  location_id: string; // locations
  associate_company_ids: string[];
  type: CustomLibraryCompanyTypeValue;
  contacts: CustomLibraryVendorContact[];
  created_at: string;
  updated_at: string;
}

export interface CustomLibraryAttribute {
   id: string;
   name: string;
   description: string;
   images: string[];
   attributes: CustomLibraryBasicAttribute[];
   specification: CustomLibraryBasicAttribute[];
   options: {
     title: string;
     use_image: boolean;
     tag: string;
     items: {
       image?: string;
       description: string;
       product_id: string; /// text input
     }[];
   }[];
   collection_id: string;
   custom_library_company_id: string; /// custom_library_companies
   relation_id: string;
   created_at: string;
   updated_at: string;
}
