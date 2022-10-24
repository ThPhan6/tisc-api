import MarketAvailabilityModel from "@/model/market_availability.model";
import { IMarketAvailabilityAttributes } from "@/types/market_availability.type";
import BaseRepository from "./base.repository";

class MarketAvailabilityRepository extends BaseRepository<IMarketAvailabilityAttributes> {
  protected model: MarketAvailabilityModel;
  protected DEFAULT_ATTRIBUTE: Partial<IMarketAvailabilityAttributes> = {
    collection_id: "",
    collection_name: "",
    country_ids: [],
    created_at: "",
  };
  constructor() {
    super();
    this.model = new MarketAvailabilityModel();
  }

  public async findMarketAvailabilityByCollection(collectionId: string) {
    return (await this.model
      .where("collection_id", "==", collectionId)
      .first()) as IMarketAvailabilityAttributes;
  }
}

export const marketAvailabilityRepository = new MarketAvailabilityRepository();
export default MarketAvailabilityRepository;
