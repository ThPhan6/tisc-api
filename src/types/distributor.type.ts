import { IPagination } from "@/types";

export interface IDistributorAttributes {
  id: string;
  brand_id: string;
  name: string;
  country_name: string;
  country_id: string;
  state_id: string;
  state_name: string;
  city_name: string;
  city_id: string;
  address: string;
  phone_code: string;
  postal_code: string;
  first_name: string;
  last_name: string;
  gender: boolean;
  email: string;
  phone: string;
  mobile: string;
  authorized_country_ids: string[];
  authorized_country_name: string;
  coverage_beyond: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface ListDistributorPagination {
  pagination: IPagination;
  data: IDistributorAttributes[];
}
