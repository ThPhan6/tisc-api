export interface GeneralInquiryAttribute {
  /// general inquiry
  id: string;
  product_id: string;
  title: string;
  message: string;
  inquiry_for_id: string; /// common type
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
  inquirer: string;
}
