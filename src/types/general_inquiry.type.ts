import { RespondedOrPendingStatus } from "./common.type";

export interface GeneralInquiryAttribute {
  id: string;
  product_id: string;
  title: string;
  message: string;
  inquiry_for_ids: string[];
  status: RespondedOrPendingStatus;
  read_by: string[];
  created_at: string;
  updated_at: null | string;
  created_by: string;
}

export interface ListGeneralInquiryCustom {
  id: string;
  created_at: string;
  title: string;
  status: RespondedOrPendingStatus;
  design_firm: string;
  firm_state_name: string;
  firm_country_name: string;
  inquirer_firstname: string;
  inquirer_lastname: string;
  inquiry_for: string;
  read: boolean;
}

export type SortValidGeneralInquiry =
  | "created_at"
  | "design_firm"
  | "firm_location"
  | "inquiry_for";
