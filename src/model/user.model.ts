import { SYSTEM_TYPE } from "../constant/common.constant";
import Model from "./index";

export interface IUserAttributes {
  id: string;
  role_id: string;
  firstname: string;
  lastname: string;
  gender?: boolean;
  location_id?: string;
  department?: string;
  position?: string;
  email: string;
  phone?: string;
  mobile?: string;
  password?: string;
  avatar?: string;
  backup_email?: string;
  personal_mobile?: string;
  linkedin?: string;
  is_verified: boolean;
  verification_token?: string;
  reset_password_token?: string;
  status: number;
  created_at?: string;
  type: number;
  relation_id?: string;
}

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
