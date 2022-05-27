export interface IUserRequest {
  firstname: string;
  lastname: string;
  gender: boolean;
  location_id: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  role_id: string;
  backup_email?: string;
  personal_mobile?: string;
  linkedin?: string;
}

export interface IUser {
  firstname: string;
  lastname: string;
  location?: string;
  position?: string;
  email: string;
  phone?: string;
  mobile?: string;
  avatar?: string;
  backup_email?: string;
  personal_mobile?: string;
  linkedin?: string;
}

export interface IUserResponse {
  data: IUser;
  statusCode: number;
}
