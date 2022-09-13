export interface UserAttributes {
  id: string;
  role_id: string;
  firstname: string;
  lastname: string;
  gender: boolean;
  location_id: string | null;
  work_location: string | null;
  department_id: string | null;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  password: string;
  avatar: string | null;
  backup_email: string;
  personal_mobile: string;
  is_verified: boolean;
  verification_token: string | null;
  reset_password_token: string | null;
  status: number;
  created_at: string | null;
  updated_at: string | null;
  type: number;
  relation_id: string | null;
  retrieve_favourite: boolean;
}
