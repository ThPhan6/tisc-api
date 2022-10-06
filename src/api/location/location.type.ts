import { ICityAttributes } from "../../model/city";
import { ICountryAttributes } from "../../model/country";
import { IStateAttributes } from "../../model/state";
import { IPagination } from "../../type/common.type";

export interface IFunctionalTypesResponse {
  data: {
    id: string;
    name: string;
  }[];
  statusCode: number;
}

export interface ILocation {
  id: string;
  business_name: string;
  business_number: string;
  functional_types: {
    id: string;
    name: string;
  }[];
  address: string;
  postal_code: string;
  general_phone: string;
  general_email: string;
  created_at: string;
  country_id: string;
  state_id: string | null;
  city_id: string | null;
  country_name: string;
  state_name: string | null;
  city_name: string | null;
  phone_code: string;
}

export interface ILocationResponse {
  data: ILocation;
  statusCode: number;
}
export interface ILocationsResponse {
  data: {
    locations: Array<ILocation>;
    pagination: IPagination;
  };
  statusCode: number;
}

export interface ILocationRequest {
  business_name: string;
  business_number?: string;
  functional_type_ids: string[];
  country_id: string;
  state_id: string;
  city_id: string;
  address: string;
  postal_code: string;
  general_phone: string;
  general_email: string;
}

export interface ICountriesResponse {
  data: ICountryAttributes[];
  statusCode: number;
}
export interface IStatesResponse {
  data: IStateAttributes[];
  statusCode: number;
}
export interface ICitiesResponse {
  data: ICityAttributes[];
  statusCode: number;
}
export interface ICountryResponse {
  data: ICountryAttributes;
  statusCode: number;
}
export interface IStateResponse {
  data: IStateAttributes;
  statusCode: number;
}
export interface ICityResponse {
  data: ICityAttributes;
  statusCode: number;
}

export interface LocationsWithGroupResponse {
  data: {
    country_name: string;
    count: number;
    locations: {
      id: string;
      business_name: string;
      business_number?: string;
      functional_types: {
        id: string;
        name: string;
      }[];
      address: string;
      postal_code: string;
      created_at: string;
      country_id: string;
      state_id: string | null;
      city_id: string;
      country_name: string;
      state_name: string | null;
      city_name: string;
      phone_code: string;
      general_phone?: string;
      general_email?: string;
    }[];
  }[];
  statusCode: number;
}
