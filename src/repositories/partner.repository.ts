import PartnerModel from "@/models/partner.model";
import BaseRepository from "@/repositories/base.repository";
import { SortOrder } from "@/types";
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

  public getListPartnerCompanyWithPagination = async (
    limit: number,
    offset: number,
    sort: "name" | "country_name" | "city_name",
    order: SortOrder
  ) => {
    const query = this.model
      .getQuery()
      .select([
        "name",
        "country_name",
        "city_name",
        "affiliation",
        "relation",
        "acquisition",
        "price_rate",
        "authorized_country_name",
        "coverage_beyond",
      ])
      .order(sort, order)
      .paginate(limit, offset);

    const result = await query;

    return {
      partners: result.data,
      pagination: result.pagination,
    };
  };

  constructor() {
    super();
    this.model = new PartnerModel();
  }
}

export default new PartnerRepository();
export const partnerRepository = new PartnerRepository();
