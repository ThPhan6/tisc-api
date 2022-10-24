import { IMarketAvailabilityAttributes } from "@/types/market_availability.type";
import Model from "@/Database/Model";

export default class MarketAvailabilityModel extends Model<IMarketAvailabilityAttributes> {
  protected table = "market_availabilities";
  protected softDelete = true;
}
