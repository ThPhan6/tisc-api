export interface InvoiceRequestCreate {
  service_type_id: string;
  brand_id: string;
  ordered_by: string;
  unit_rate: number;
  quantity: number;
  tax: number;
  remark?: string;
}

export interface InvoiceRequestUpdate {
  service_type_id?: string;
  brand_id?: string;
  ordered_by?: string;
  unit_rate?: number;
  quantity?: number;
  tax?: number;
  remark?: string;
}

export type GetListInvoiceSorting =
  | "created_at"
  | "service_type_name"
  | "ordered_by"
  | "brand_name";

export interface PaymentIntentAttributes {
  id: string;
  request_id: string;
  amount: number;
  currency: string;
  merchant_order_id: string;
  metadata: any;
  status: string;
  captured_amount: number;
  created_at: string;
  updated_at: string;
  available_payment_method_types: string[];
  client_secret: string;
  base_amount: number;
}
