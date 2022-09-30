export interface IProjectZoneAttributes {
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
  updated_at: string | null;
}
