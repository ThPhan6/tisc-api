import { inquiry } from "./../api/general_inquiry/general_inquiry.response";
export interface GeneralInquiryAttribute {
  /// general inquiry
  id: string;
  product_id: string;
  title: string;
  message: string;
  inquiry_for_ids: string[]; /// common type
  status: number; /// need to define type here ---// Pending, Responded
  read: string[]; /// user_id[];
  created_at: string;
  updated_at: null | string;
  created_by: string;
}

export interface ListGeneralInquiryCustom {
  general_inquiry: GeneralInquiryAttribute;
  inquiry_for: string;
  design_firm: {
    name: string;
    state_name: string | null;
    country_name: string | null;
  };
  inquiries_for: {
    id: string;
    name: string;
  }[];
  inquirer: string;
}

export type SortValidGeneralInquiry =
  | "created_at"
  | "design_firm"
  | "firm_location"
  | "inquiry_for";
