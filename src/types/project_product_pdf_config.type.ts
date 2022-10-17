export interface ProjectProductPDFConfigAttribute {
  id: string;
  project_id: string;
  location_id: string; // design firm location
  issuing_for_id: string; // new common type
  issuing_date: string; // datetime
  revision: string;
  has_cover: boolean;
  document_title: string;
  template_ids: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
