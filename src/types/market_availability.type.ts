export interface IMarketAvailabilityAttributes {
  id: string;
  collection_id: string;
  countries: {
    id: string;
    available: boolean;
  }[];
  created_at: string;
  updated_at: string;
}

export interface RegionMarket {
  id: string;
  available: boolean;
  region: string;
  phone_code: string;
  name: string;
}

export interface ListMarketAvailability extends Pick<
  IMarketAvailabilityAttributes,
  'id' | 'countries' | 'collection_id'
> {
  name: string;
  relation_id: string;
  authorized_countries: (RegionMarket & {
    name: string;
  })[];
}
