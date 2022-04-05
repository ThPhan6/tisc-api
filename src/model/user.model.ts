import Model from "./index";

export interface IUserAttributes {
  id: string;
  role_id: string;
  fullname: string;
  password: string;
  email: string;
  phone_number?: string;
  company_name?: string;
  address?: string;
  is_verified: boolean;
  verification_token?: string;
  reset_password_token?: string;
  status: number;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export default class UserModel extends Model<IUserAttributes> {
  constructor() {
    super("user");
  }
}
