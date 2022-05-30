export interface IDesignersResponse {
  data: {
    id: string;
    name: string;
    logo: string;
    origin: string;
    main_office: string;
    satellites: number;
    designers: number;
    capacities: number;
    projects: number;
    live: number;
    on_hold: number;
    archived: number;
    status: number;
    assign_team: any;
    created_at: string;
  }[];
  statusCode: number;
}

export interface IDesignerResponse {
  data: any;
  statusCode: number;
}
