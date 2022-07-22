import { SYSTEM_TYPE } from "../constant/common.constant";
import Model from "./index";

export interface ILocationAttributes {
  id: string;
  business_name: string;
  business_number: string;
  functional_type_ids: string[];
  functional_type: string;
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
  type: number;
  relation_id: string | null;
}

export const LOCATION_NULL_ATTRIBUTES = {
  id: null,
  business_name: null,
  business_number: null,
  functional_type_ids: [],
  functional_type: null,
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
  type: SYSTEM_TYPE.TISC,
  relation_id: null,
};

export default class LocationModel extends Model<ILocationAttributes> {
  constructor() {
    super("locations");
  }
  public getOriginLocation = async (
    relation_id: string
  ): Promise<ILocationAttributes | false> => {
    try {
      const result: any = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where("relation_id", relation_id)
        .orderBy("created_at", "DESC")
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
  public getFirstHeadquarterLocation = async (
    relation_id: string,
    headquarter_id: string
  ): Promise<ILocationAttributes | false> => {
    try {
      const result: any = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .where("relation_id", relation_id)
        .whereInRevert("functional_type_ids", headquarter_id)
        .orderBy("created_at", "DESC")
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}
