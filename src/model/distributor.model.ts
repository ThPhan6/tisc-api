import Model from "./index";

export interface IDistributorAttributes {
  id: string;
  brand_id: string;
  name: string;
  country_name: string;
  country_id: string;
  state_id: string;
  state_name: string;
  city_name: string;
  city_id: string;
  address: string;
  phone_code: string;
  postal_code: string;
  first_name: string;
  last_name: string;
  gender: boolean;
  email: string;
  phone: string;
  mobile: string;
  authorized_country_ids: string[];
  authorized_country_name: string;
  coverage_beyond: boolean;
  created_at: string;
}

export const DISTRIBUTOR_NULL_ATTRIBUTES = {
  id: null,
  brand_id: null,
  name: null,
  country_name: null,
  country_id: null,
  state_id: null,
  state_name: null,
  city_name: null,
  city_id: null,
  address: null,
  phone_code: null,
  postal_code: null,
  first_name: null,
  last_name: null,
  gender: false,
  email: null,
  phone: null,
  mobile: null,
  authorized_country_ids: [],
  authorized_country_name: null,
  coverage_beyond: false,
  created_at: null,
};

export default class DistributorModel extends Model<IDistributorAttributes> {
  constructor() {
    super("distributors");
  }

  public getExistedBrandDistributor = async (
    id: string,
    brand_id: string,
    name: string
  ): Promise<IDistributorAttributes | false> => {
    try {
      const result: any = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where("brand_id", brand_id)
        .whereNot("id", id)
        .where("name", name)
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };

  public getMarketDistributor = async (
    brand_id: string,
    countries: string[]
  ): Promise<IDistributorAttributes[]> => {
    try {
      const result: any = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where("brand_id", brand_id)
        .whereIn("country_id", countries)
        .select();
      return result;
    } catch (error) {
      return [];
    }
  };
}
