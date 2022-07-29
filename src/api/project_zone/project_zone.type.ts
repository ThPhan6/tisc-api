export interface IProjectZoneRequest {
  project_id: string;
  name: string;
  area: {
    name: string;
    room: {
      room_name: string;
      room_id: string;
      room_size: number;
      room_size_unit: string;
      quantity: number;
    }[];
  }[];
}

export interface IProjectZoneResponse {
  data: {
    id: string;
    project_id: string;
    name: string;
    area: {
      name: string;
      room: {
        room_name: string;
        room_id: string;
        room_size: string;
        quantity: number;
        sub_total: string;
      }[];
    }[];
    created_at: string;
  };
  statusCode: number;
}
