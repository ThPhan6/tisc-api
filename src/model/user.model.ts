import { SYSTEM_TYPE } from "../constant/common.constant";
import Model from "./index";

export interface IUserAttributes {
  id: string;
  role_id: string;
  firstname: string;
  lastname: string;
  gender: boolean | null;
  location_id: string | null;
  department: string | null;
  position: string | null;
  email: string;
  phone: string | null;
  mobile: string | null;
  password: string | null;
  avatar: string | null;
  backup_email: string | null;
  personal_mobile: string | null;
  linkedin: string | null;
  is_verified: boolean;
  verification_token: string | null;
  reset_password_token: string | null;
  status: number;
  created_at: string | null;
  type: number;
  relation_id: string | null;
}

export const USER_NULL_ATTRIBUTES = {
  id: null,
  role_id: null,
  firstname: null,
  lastname: null,
  gender: null,
  location_id: null,
  department: null,
  position: null,
  email: null,
  phone: null,
  mobile: null,
  password: null,
  avatar: null,
  backup_email: null,
  personal_mobile: null,
  linkedin: null,
  is_verified: null,
  verification_token: null,
  reset_password_token: null,
  status: null,
  created_at: null,
  type: null,
  relation_id: null,
};

export default class UserModel extends Model<IUserAttributes> {
  constructor() {
    super("users");
  }

  public getFirstBrandAdmin = async (brand_id: string) => {
    try {
      const result: any = await this.builder

        .where("type", SYSTEM_TYPE.BRAND)
        .where("relation_id", brand_id)
        .orderBy("created_at")
        .first();
      return result;
    } catch (error) {
      // console.log(error);
      return false;
    }
  };
}
