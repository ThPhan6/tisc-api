import Model from "@/Database/Model";

export interface ProjectZoneAttributes {
  id: string;
  project_id: string;
  name: string;
  areas: {
    id: string;
    name: string;
    rooms: {
      id: string;
      room_name: string;
      room_id: string;
      room_size: number;
      quantity: number;
      sub_total: number;
    }[];
  }[];
  created_at: string;
  is_deleted: boolean;
}

export default class ProjectZoneModel extends Model<ProjectZoneAttributes> {
  protected table = "project_zones";
  protected softDelete = true;
}
