import { ActiveStatus, ILocationAttributes, IPagination } from "@/types";

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
    pagination: IPagination;
  };
  statusCode: number;
}

export interface DesignerDataCustom {
  designer: {
    created_at: string;
    id: string;
    logo: string | null;
    name: string;
    status: ActiveStatus;
  };
  userCount: number;
  origin_location: ILocationAttributes[];
  projects: number[];
  assign_team: {
    avatar: string | null;
    email: string;
    firstname: string;
    id: string;
    lastname: string;
    updated_at: string | null;
  }[];
}

export type GetDesignFirmSort =
  | "created_at"
  | "name"
  | "origin"
  | "main_office";
