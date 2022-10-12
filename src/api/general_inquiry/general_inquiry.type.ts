export interface GeneralInquiryRequest {
  product_id: string;
  title: string;
  message: string;
  inquiry_for_ids: string[]; /// common type
}
