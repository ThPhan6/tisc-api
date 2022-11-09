import { Pagination, ILocationAttributes } from "@/types";

export interface IDistributorAttributes {
  id: string;
  brand_id: string;

  // company information
  name: string;
  location_id: string;

  // Contact person
  first_name: string;
  last_name: string;
  gender: boolean;
  email: string;
  phone: string;
  mobile: string;
  coverage_beyond: boolean;

  // Distribution territory
  authorized_country_ids: string[];
  authorized_country_name: string;

  created_at: string;
  updated_at: string | null;
}

export interface ListDistributorPagination {
  pagination: Pagination;
  data: IDistributorAttributes[];
}

export interface DistributorWithLocation
  extends IDistributorAttributes,
    ILocationAttributes {}
