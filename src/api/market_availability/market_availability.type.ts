export interface IMarketAvailabilityRequest {
  collection_id: string;
  country_ids: string[];
}
export interface IUpdateMarketAvailabilityRequest {
  countries: {
    id: string;
    available: boolean;
  }[];
}
export interface IMarketAvailabilityResponse {
  data: {
    collection_id: string;
    collection_name: string;
    total_available: number;
    total: number;
    regions: {
      name: string;
      count: number;
      countries: {
        id: string;
        name: string;
        phone_code: string;
        region: string;
        available: boolean;
      }[];
    }[];
  };
  statusCode: number;
}

export interface IMarketAvailabilitiesResponse {
  data: {
    collections: {
      collection_id: string;
      collection_name: string;
      available_countries: number;
      africa: number;
      asia: number;
      europe: number;
      north_america: number;
      oceania: number;
      south_america: number;
    }[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      page_count: number;
    };
  };
  statusCode: number;
}

export interface IMarketAvailabilityGroupByCollectionResponse {
  data: {
    collection_name: string;
    count: number;
    regions: {
      region_name: string;
      count: number;
      region_country: string;
    }[];
  }[];
  statusCode: number;
}
