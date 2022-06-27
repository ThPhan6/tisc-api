import Model from "./index";

export interface ILocationAttributes {
  id: string;
  business_name: string;
  business_number: string;
  functional_type_ids: string[];
  country_id: string;
  country_name: string;
  state_id: string | null;
  state_name: string | null;
  city_id: string;
  city_name: string;
  phone_code: string;
  address: string;
  postal_code: string;
  general_phone: string;
  general_email: string;
  created_at: string;
  is_deleted: boolean;
}

export const LOCATION_NULL_ATTRIBUTES = {
  id: null,
  business_name: null,
  business_number: null,
  functional_type_ids: [],
  country_id: null,
  state_id: null,
  city_id: null,
  country_name: null,
  state_name: null,
  city_name: null,
  phone_code: null,
  address: null,
  postal_code: null,
  general_phone: null,
  general_email: null,
  created_at: null,
  is_deleted: false,
};

export default class LocationModel extends Model<ILocationAttributes> {
  constructor() {
    super("locations");
  }
}
