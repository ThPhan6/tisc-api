export interface IUserRequest {
  firstname: string;
  lastname: string;
  gender: boolean;
  location_id: string;
  department_id: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  role_id: string;
  backup_email?: string;
  personal_mobile?: string;
  linkedin?: string;
}
export interface IUpdateMeRequest {
  backup_email?: string;
  personal_mobile?: string;
  zone_code?: string;
  linkedin?: string;
}

export interface IUser {
  firstname: string;
  lastname: string;
  location_id: string | null;
  department_id: string | null;
  position: string | null;
  email: string;
  phone: string | null;
  mobile: string | null;
  avatar: string | null;
  backup_email: string | null;
  personal_mobile: string | null;
  linkedin: string | null;
}

export interface IUserResponse {
  data: IUser;
  statusCode: number;
}

export interface IAvatarResponse {
  data: {
    url: string;
  };
  statusCode: number;
}
export interface IDepartmentsResponse {
  data: {
    id: string;
    name: string;
  }[];
  statusCode: number;
}
