import PartnerModel from "@/models/partner.model";
import BaseRepository from "@/repositories/base.repository";
import { PartnerAttributes } from "@/types/partner.type";

class PartnerRepository extends BaseRepository<PartnerAttributes> {
  protected model: PartnerModel;
  protected DEFAULT_ATTRIBUTE: Partial<PartnerAttributes> = {
    name: "",
    country_id: "",
    city_id: "",
    contact: "",
    affiliation: "",
    relation: false,
    acquisition: 1,
    price_rate: 0,
    authorized_country_ids: [],
    coverage_beyond: false,
    location_id: "",
    website: "",
  };

  constructor() {
    super();
    this.model = new PartnerModel();
  }
}

export default new PartnerRepository();
export const partnerRepository = new PartnerRepository();
