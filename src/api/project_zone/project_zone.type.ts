export interface IProjectZoneRequest {
  project_id: string;
  name: string;
  areas: {
    name: string;
    rooms: {
      room_name: string;
      room_id: string;
      room_size: number;
      quantity: number;
    }[];
  }[];
}
export interface IUpdateProjectZoneRequest {
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
    }[];
  }[];
}

export interface IProjectZoneResponse {
  data: {
    id: string;
    project_id: string;
    name: string;
    areas: {
      name: string;
      rooms: {
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
      areas: {
        id: string;
        name: string;
        count: number;
        rooms: {
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
      value: any;
    }[];
  };
  statusCode: number;
}
