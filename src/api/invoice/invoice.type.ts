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
  | "brand_name";
