import { Pagination } from "@/types";

export interface PartnerRequest {
  brand_id: string;
  name: string;
  website: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  phone: string;
  email: string;
  affiliation_id: string;
  relation_id: string;
  acquisition_id: string;
  price_rate: number;
  authorized_country_ids: string[];
  coverage_beyond: boolean;
  remark: string;
}

export interface PartnerResponse {
  data: {
    partners: {
      name: string;
      country_name: string;
      city_name: string;
      contact: string;
      affiliation_name: string;
      relation_name: string;
      acquisition_name: string;
      price_rate: number;
      authorized_country_name: string;
      coverage_beyond: boolean;
    };
    pagination: Pagination;
  };
  statusCode: number;
}
