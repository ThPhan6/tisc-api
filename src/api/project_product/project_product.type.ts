export interface AssignProductToProjectRequest {
  is_entire: boolean;
  product_id: string;
  project_id: string;
  project_zone_ids: string[];
}
