import { DesignStatusValue } from "@/types";
import { IPagination } from "./../../type/common.type";
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

export interface IDesignerResponse {
  data: any;
  statusCode: number;
}

export interface IDesignSummary {
  data: {
    id: string;
    quantity: number;
    label: string;
    subs: {
      id: string;
      quantity: number;
      label: string;
    }[];
  }[];
  statusCode: number;
}

export interface IUpdateDesignStatusRequest {
  status: DesignStatusValue;
}
