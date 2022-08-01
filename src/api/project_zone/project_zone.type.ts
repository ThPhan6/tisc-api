export interface IProjectZoneRequest {
  project_id: string;
  name: string;
  area: {
    name: string;
    room: {
      room_name: string;
      room_id: string;
      room_size: number;
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
        room_size: number;
        quantity: number;
        sub_total: number;
        room_size_unit: string;
      }[];
    }[];
    created_at: string;
  };
  statusCode: number;
}

export interface IProjectZonesResponse {
  data: {
    project_zones: {
      id: string;
      project_id: string;
      name: string;
      count: number;
      area: {
        id: string;
        name: string;
        count: number;
        room: {
          id: string;
          room_name: string;
          room_id: string;
          room_size: number;
          quantity: number;
          sub_total: number;
          room_size_unit: string;
        }[];
      }[];
      created_at: string;
    }[];
    summary: {
      name: string;
      value: number;
    }[];
  };
  statusCode: number;
}
