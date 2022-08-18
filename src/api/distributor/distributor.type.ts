import {IDistributorAttributes} from '../../model/distributor.model';

export interface IDistributorRequest {
  brand_id: string;
  name: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  first_name: string;
  last_name: string;
  gender: boolean;
  email: string;
  phone: string;
  mobile: string;
  authorized_country_ids: string[];
  coverage_beyond: boolean;
  created_at: string;
}

export interface IDistributorResponse {
  data: {
    brand_id: string;
    name: string;
    country_name: string;
    country_id: string;
    state_name: string;
    state_id: string;
    city_name: string;
    city_id: string;
    address: string;
    postal_code: string;
    first_name: string;
    last_name: string;
    gender: boolean;
    email: string;
    phone: string;
    mobile: string;
    authorized_country_ids: string[];
    authorized_country_name: string;
    authorized_countries: {
      id: string;
      name: string;
    }[];
    coverage_beyond: boolean;
    created_at: string;
  };
  statusCode: number;
}
export interface IDistributorsResponse {
  data: {
    distributors: {
      id: string;
      name: string;
      country_name: string;
      city_name: string;
      first_name: string;
      last_name: string;
      email: string;
      authorized_country_name: string;
      coverage_beyond: boolean;
      created_at: string;
    }[];
    pagination: any;
  };
  statusCode: number;
}

export interface IDistributorGroupByCountryResponse {
  data: {
    country_name: string;
    count: number;
    distributors: {
      name: string;
      address: string;
      person: string;
      gender: boolean;
      email: string;
      phone: string;
      mobile: string;
      authorized_country_name: string;
      coverage_beyond: boolean;
    }[];
  }[];
  statusCode: number;
}

export interface MarketDistributorGroupByCountry {
  country_name: string;
  count: number;
  distributors: IDistributorAttributes[];
}

export interface MarketDistributorGroupByCountryResponse {
  data: MarketDistributorGroupByCountry[],
  statusCode: number;
}
