import Model from "./index";

export interface IMarketAvailabilityAttributes {
  id: string;
  collection_id: string;
  collection_name: string;
  country_ids: string[];
  created_at: string;
  is_deleted: boolean;
}

export const MARKET_AVAILABILITY_NULL_ATTRIBUTES = {
  id: null,
  collection_id: null,
  collection_name: null,
  country_ids: [],
  created_at: null,
  is_deleted: false,
};

export default class MarketAvailabilityModel extends Model<IMarketAvailabilityAttributes> {
  constructor() {
    super("market_availabilities");
  }
}
