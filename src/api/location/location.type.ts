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
  country: {
    id: string;
    name: string;
  };
  state: {
    id: string;
    name: string;
  };
  city: {
    id: any;
    name: any;
  };
  address: string;
  postal_code: string;
  general_phone: string;
  general_email: string;
  created_at: string;
  phone_code: string;
}

export interface ILocationResponse {
  data: ILocation;
  statusCode: number;
}
export interface ILocationsResponse {
  data: ILocation[];
  statusCode: number;
}

export interface ILocationRequest {
  business_name: string;
  business_number: string;
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
  data: {
    id: string;
    name: string;
    phone_code: string;
  }[];
  statusCode: number;
}
export interface IStatesResponse {
  data: {
    id: string;
    name: string;
  }[];
  statusCode: number;
}
