import {
  ICollectionAttributes,
  IDistributorAttributes,
  ILocationAttributes,
  IProductAttributes,
  IPagination,
} from "@/types";

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

export interface IBrandSummary {
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

export interface ListBrandCustom {
  brand: {
    id: string;
    name: string;
    parent_company: string | null;
    logo: string | null;
    slogan: null;
    mission_n_vision: string | null;
    official_websites: string[];
    team_profile_ids: string[];
    location_ids: string[];
    status: number;
    created_at: string;
    updated_at: string | null;
  };
  locations: number;
  origin_location: ILocationAttributes;
  collection: number;
  cards: IProductAttributes[];
  users: number;
  distributors: IDistributorAttributes[];
  assign_team: {
    avatar: string;
    email: string;
    firstname: string;
    id: string;
    lastname: string;
  }[];
}

export interface BrandDataSummary {
  created_at: string;
  id: string;
  is_deleted: false;
  location_ids: string[];
  logo: null;
  mission_n_vision: null;
  name: string;
  official_websites: string[];
  parent_company: null;
  slogan: null;
  status: number;
  team_profile_ids: string[];
  updated_at: null;
  products: IProductAttributes;
  locations: ILocationAttributes;
  collections: ICollectionAttributes;
}
