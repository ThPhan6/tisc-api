import Model from "./index";

export interface IMarketAvailabilityAttributes {
  id: string;
  collection_id: string;
  collection_name: string;
  countries: {
    id: string;
    name: string;
    phone_code: string;
    region: string;
  }[];
  created_at: string;
  is_deleted: boolean;
}

export const MARKET_AVAILABILITY_NULL_ATTRIBUTES = {
  id: null,
  collection_id: null,
  collection_name: null,
  countries: [],
  created_at: null,
  is_deleted: false,
};

export default class MarketAvailabilityModel extends Model<IMarketAvailabilityAttributes> {
  constructor() {
    super("market_availabilities");
  }
}
