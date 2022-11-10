export interface InvoiceAttributes {
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
  created_by: string;
  created_at: string;
}
