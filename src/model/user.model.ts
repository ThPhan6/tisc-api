import Model from "./index";

export interface IUserAttributes {
  id: string;
  role_id: string;
  fullname: string;
  email: string;
  phone?: string;
  mobile?: string;
  password: string;
  avatar?: string;
  backup_email?: string;
  personal_mobile?: string;
  is_verified: boolean;
  verification_token?: string;
  reset_password_token?: string;
  status: number;
  created_at?: string;
  model: string;
  relation_id?: string;
}

export default class UserModel extends Model<IUserAttributes> {
  constructor() {
    super("users");
  }
}
