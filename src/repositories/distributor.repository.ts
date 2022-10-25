import DistributorModel from "@/model/distributor.model";
import { IDistributorAttributes, ListDistributorPagination } from "@/types";
import BaseRepository from "./base.repository";

class DistributorRepository extends BaseRepository<IDistributorAttributes> {
  protected model: DistributorModel;
  protected DEFAULT_ATTRIBUTE: Partial<IDistributorAttributes> = {
    brand_id: "",
    name: "",
    country_name: "",
    country_id: "",
    state_id: "",
    state_name: "",
    city_name: "",
    city_id: "",
    address: "",
    phone_code: "",
    postal_code: "",
    first_name: "",
    last_name: "",
    gender: false,
    email: "",
    phone: "",
    mobile: "",
    authorized_country_ids: [],
    authorized_country_name: "",
    coverage_beyond: false,
    created_at: "",
  };
  constructor() {
    super();
    this.model = new DistributorModel();
  }

  public async getExistedBrandDistributor(
    id: string,
    brandId: string,
    name: string
  ) {
    return (await this.model
      .where("brand_id", "==", brandId)
      .where("id", "!=", id)
      .where("name", "==", name)
      .first()) as IDistributorAttributes;
  }

  public async getMarketDistributor(brandId: string, countries: string[]) {
    return (await this.model
      .select()
      .where("brand_id", "==", brandId)
      .where("country_id", "in", countries)
      .get()) as IDistributorAttributes[];
  }

  public async getListDistributorWithPagination(
    limit: number,
    offset: number,
    brandId: string,
    sort: string,
    order: "ASC" | "DESC"
  ) {
    if (sort && order) {
      return (await this.model
        .select()
        .where("brand_id", "==", brandId)
        .order(sort, order)
        .paginate(limit, offset)) as ListDistributorPagination;
    }

    return (await this.model
      .select()
      .where("brand_id", "==", brandId)
      .paginate(limit, offset)) as ListDistributorPagination;
  }
}

export const distributorRepository = new DistributorRepository();
export default DistributorRepository;
