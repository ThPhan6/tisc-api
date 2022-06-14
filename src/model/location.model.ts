import Model from "./index";

export interface ILocationAttributes {
  id: string;
  business_name: string;
  business_number: string;
  functional_type_ids: string[];
  country_id: string;
  state_id: string;
  city_id: string;
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
