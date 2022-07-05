import Model from "./index";

export interface IDistributorAttributes {
  brand_id: string;
  name: string;
  country_name: string;
  city_name: string;
  location: {
    country_id: string;
    state_id: string;
    city_id: string;
    address: string;
  };
  postal_code: string;
  first_name: string;
  last_name: string;
  gender: boolean;
  email: string;
  phone: string;
  mobile: string;
  authorized_country_ids: string[];
  coverage_beyond: boolean;
  created_at: string;
  is_deleted: boolean;
}

export const DISTRIBUTOR_NULL_ATTRIBUTES = {
  brand_id: null,
  name: null,
  country_name: null,
  city_name: null,
  location: {
    country_id: null,
    state_id: null,
    city_id: null,
    address: null,
  },
  postal_code: null,
  first_name: null,
  last_name: null,
  gender: null,
  email: null,
  phone: null,
  mobile: null,
  authorized_country_ids: null,
  coverage_beyond: null,
  created_at: null,
  is_deleted: false,
};

export default class DistributorModel extends Model<IDistributorAttributes> {
  constructor() {
    super("distributors");
  }
}
