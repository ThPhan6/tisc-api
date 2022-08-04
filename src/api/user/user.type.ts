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
  interested?: number[];
}

export interface IUser {
  firstname: string;
  lastname: string;
  fullname: string;
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
  brand?: any;
  design?: any;
}

export interface IUserResponse {
  data: IUser;
  statusCode: number;
}
export interface IUsersResponse {
  data: {
    users: {
      id: string;
      firstname: string;
      lastname: string;
      work_location: string | null;
      position: string | null;
      email: string;
      phone: string | null;
      access_level: string;
      status: number;
      avatar: string | null;
      created_at: string | null;
    }[];
    pagination: any;
  };
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

export interface IGetTeamsGroupByCountry {
  data: {
    country_name: string;
    users: {
      logo: string;
      firstname: string;
      lastname: string;
      gender: boolean;
      work_location: string | null;
      department: string;
      position: string | null;
      email: string;
      phone: string | null;
      mobile: string | null;
      access_level: string;
      status: number;
      phone_code: string;
    }[];
  }[];
  statusCode: number;
}
