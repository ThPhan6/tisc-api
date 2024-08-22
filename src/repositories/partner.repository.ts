import PartnerModel from "@/models/partner.model";
import BaseRepository from "@/repositories/base.repository";
import { SortOrder } from "@/types";
import { PartnerAttributes } from "@/types/partner.type";

class PartnerRepository extends BaseRepository<PartnerAttributes> {
  protected model: PartnerModel;
  protected DEFAULT_ATTRIBUTE: Partial<PartnerAttributes> = {
    name: "",
    brand_id: "",
    country_id: "",
    city_id: "",
    contact: "",
    affiliation_id: "",
    affiliation_name: "",
    relation_id: "",
    relation_name: "",
    acquisition_id: "",
    acquisition_name: "",
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
    order: SortOrder,
    brandId: string | null,
    filter: {
      affiliation_id?: string;
      relation_id?: string;
      acquisition_id?: string;
    } = {}
  ) => {
    let query = this.model
      .getQuery()
      .select([
        "name",
        "country_name",
        "city_name",
        "contact",
        "affiliation_name",
        "relation_name",
        "acquisition_name",
        "price_rate",
        "authorized_country_name",
        "coverage_beyond",
      ]);

    if (brandId) {
      query = query.where("brand_id", "==", brandId);
    }

    if (filter.affiliation_id) {
      query = query.where("affiliation_id", "==", filter.affiliation_id);
    }

    if (filter.relation_id) {
      query = query.where("relation_id", "==", filter.relation_id);
    }

    if (filter.acquisition_id) {
      query = query.where("acquisition_id", "==", filter.acquisition_id);
    }

    query = query.order(sort, order);

    const result = await query.paginate(limit, offset);

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
