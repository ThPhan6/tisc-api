export interface WarehouseEntity {
  id: string;
  name: string;
  type: number;
  status: number;
  parent_id: string;
  location_id: string;
  relation_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
