export enum InvoiceCompanyType {
  Brand,
  DesignFirm
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
  due_date: string;
  remark?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
