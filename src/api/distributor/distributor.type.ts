export interface IDistributor {
  brand_id: string;
  name: string;
  location: {
    country_id: string;
    state_id: string;
    city_id: string;
    address: string;
  };
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
export interface IDistributorRequest {
  brand_id: string;
  name: string;
  location: {
    country_id: string;
    state_id: string;
    city_id: string;
    address: string;
  };
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
  data: IDistributor;
  statusCode: number;
}

export interface IGetOneDistributorResponse {
  data: {
    brand_id: string;
    name: string;
    location: {
      country: {
        id: string;
        name: string;
      };
      state: {
        id: string;
        name: string;
      };
      city: {
        id: string;
        name: string;
      };
      address: string;
    };
    postal_code: string;
    first_name: string;
    last_name: string;
    gender: boolean;
    email: string;
    phone: string;
    mobile: string;
    authorized_countries: {
      id: string;
      name: string;
    }[];
    coverage_beyond: boolean;
    created_at: string;
  };
  statusCode: number;
}
export interface IGetListDistributorResponse {
  data: {
    brand_id: string;
    name: string;
    location: {
      country: {
        id: string;
        name: string;
      };
      state: {
        id: string;
        name: string;
      };
      city: {
        id: string;
        name: string;
      };
      address: string;
    };
    postal_code: string;
    first_name: string;
    last_name: string;
    gender: boolean;
    email: string;
    phone: string;
    mobile: string;
    authorized_countries: {
      id: string;
      name: string;
    }[];
    coverage_beyond: boolean;
    created_at: string;
  }[];
  statusCode: number;
}
