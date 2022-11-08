export interface CustomLibraryBasicAttribute {
  name: string;
  content: string;
}
export interface CustomLibraryContact {
  first_name: string;
  last_name: string;
  position: string;
  work_email: string;
  work_phone: string;
  work_mobile: string;
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
   brand_location_id: string; /// locations
   brand_contacts: CustomLibraryContact[];
   distributor_location_id: string; /// locations
   distributor_contacts: CustomLibraryContact[];
   created_at: string;
   updated_at: string;
}
