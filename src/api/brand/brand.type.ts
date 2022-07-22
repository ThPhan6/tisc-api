import { IPagination } from "./../../type/common.type";
export interface IBrandsResponse {
  data: {
    brands: IBrand[];
    pagination: IPagination;
  };
  statusCode: number;
}

export interface IBrandResponse {
  data: any;
  statusCode: number;
}
export interface IBrandByAlphabetResponse {
  data: {
    abc: any[];
    def: any[];
    ghi: any[];
    jkl: any[];
    mno: any[];
    pqr: any[];
    stuv: any[];
    wxyz: any[];
  };
  statusCode: number;
}

export interface IBrand {
  id: string;
  name: string;
  logo: string | null;
  origin: string;
  locations: number;
  teams: number;
  distributors: number;
  coverages: number;
  categories: number;
  collections: number;
  cards: number;
  products: number;
  assign_team: any;
  status: number;
  status_key: any;
  created_at: string;
}

export interface IBrandCardsResponse {
  data: {
    id: string;
    name: string;
    logo: string | null;
    country: string;
    category_count: number;
    collection_count: number;
    card_count: number;
    teams: any[];
  }[];
  statusCode: number;
}

export interface IUpdateBrandProfileRequest {
  name: string;
  parent_company: string;
  slogan: string;
  mission_n_vision: string;
  official_websites: {
    country_id: string;
    url: string;
  }[];
}
export interface IBrandProfileResponse {
  data: {
    id: string;
    name: string;
    parent_company: string;
    logo: string | null;
    slogan: string;
    mission_n_vision: string;
    official_websites: {
      country_id: string;
      url: string;
    }[];
  };
  statusCode: number;
}

export interface IBrandRequest {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
}
