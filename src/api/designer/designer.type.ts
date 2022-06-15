export interface IDesignersResponse {
  data: {
    designers: {
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
      status_key: any;
      assign_team: any;
      created_at: string;
    }[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      page_count: number;
    };
  };
  statusCode: number;
}

export interface IDesignerResponse {
  data: any;
  statusCode: number;
}
