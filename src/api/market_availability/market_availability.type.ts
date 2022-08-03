export interface IMarketAvailabilityRequest {
  collection_id: string;
  country_ids: string[];
}
export interface IUpdateMarketAvailabilityRequest {
  country_ids: string[];
}
export interface IMarketAvailabilityResponse {
  data: any;
  statusCode: number;
}

export interface IMarketAvailabilityGroupByCollectionResponse {
  data: any;
  statusCode: number;
}
