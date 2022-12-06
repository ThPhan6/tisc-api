import {
  TiscRoles,
  BrandRoles,
  DesignFirmRoles
} from '@/constants';

export type UserRole = TiscRoles | BrandRoles | DesignFirmRoles;

export interface UserAttributes {
  id: string;
  role_id: TiscRoles | BrandRoles | DesignFirmRoles;
  firstname: string;
  lastname: string;
  gender: boolean;
  location_id: string | null;
  work_location: string | null;
  department_id: string | null;
  position: string;
  email: string;
  phone: string;
  phone_code: string;
  mobile: string;
  password: string;
  avatar: string | null;
  backup_email: string;
  personal_mobile: string;
  personal_phone_code?: string;
  linkedin: string;
  is_verified: boolean;
  verification_token: string | null;
  reset_password_token: string | null;
  status: UserStatus;
  created_at: string | null;
  updated_at: string | null;
  type: UserType;
  relation_id: string;
  retrieve_favourite: boolean;
  interested: any[];
}

export enum UserStatus {
  Active = 1,
  Blocked = 2,
  Pending = 3,
}

export enum UserType {
  TISC = 1,
  Brand = 2,
  Designer = 3,
}

export type UserTypeKey = keyof typeof UserType;

export type UserTypeValue = `${Extract<
  UserType,
  number
>}` extends `${infer N extends number}`
  ? N
  : never;
