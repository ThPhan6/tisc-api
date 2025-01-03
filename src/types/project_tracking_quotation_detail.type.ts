export interface ProjectTrackingQuotationDetailEntity {
  id: string; // UUID - Primary Key
  project_tracking_quotation_id: string; // UUID - Foreign Key referencing project_tracking_quotations.id
  inventory_id: string; // UUID - Foreign Key referencing inventories.id
  base_price: number;
  unit_type: string;
  volume_price: number;
  quantity: number;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
}
