export interface InvoiceRequestCreate {
  service_type_id: string;
  brand_id: string;
  ordered_by: string;
  unit_rate: number;
  quantity: number;
  tax: number;
  billing_amount: number;
  due_date: string;
  remark: string;
}

export interface InvoiceRequestUpdate {
  service_type_id?: string;
  brand_id?: string;
  ordered_by?: string;
  unit_rate?: number;
  quantity?: number;
  tax?: number;
  billing_amount?: number;
  due_date?: string;
  remark?: string;
}

export interface InvoiceAttribute {
  id: string;
  service_type_id: string;
  brand_id: string;
  ordered_by: string;
  unit_rate: number;
  quantity: number;
  tax: number;
  billing_amount: number;
  due_date: string;
  remark: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  overdue_amount: number;
}
