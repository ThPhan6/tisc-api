export interface ProjectTrackingQuotationEntity {
  id: string; // UUID - Primary Key
  project_tracking_id: string; // UUID - Foreign Key referencing project_trackings.id
  currency_id: string; // UUID - Foreign Key referencing exchange_currencies.id
  extra_cost: number;
  installation_fee: number;
  service_fee: number;
  other_fee: number;
  tax_rate: number;
  pdf_setting: Record<string, boolean>; // Record of PDF_SETTING_NAME to boolean
  pdf_file: string;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
}
