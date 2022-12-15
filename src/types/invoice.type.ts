export enum InvoiceCompanyType {
  Brand,
  DesignFirm
}

export enum InvoiceStatus {
  Outstanding,
  Overdue,
  Paid,
  Pending
}

export interface InvoiceAttributes {
  id: string;
  name: string;
  service_type_id: string;
  relation_id: string;
  relation_type: InvoiceCompanyType;
  ordered_by: string;
  unit_rate: number;
  quantity: number;
  tax: number;
  due_date?: string;
  billed_date?: string;
  payment_date?: string;
  remark?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: InvoiceStatus
}
