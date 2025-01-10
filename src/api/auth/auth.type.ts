export interface IAdminLoginRequest {
  email: string;
  password: string;
}

export interface IForgotPasswordRequest {
  email: string;
  type: number;
}

export interface IResetPasswordRequest {
  reset_password_token: string;
  password: string;
  confirmed_password: string;
}

export interface IForgotPasswordResponse {
  reset_password_token: string;
  message: string;
  statusCode?: number;
}

export interface ILoginResponse {
  token: string;
  type?: string;
  workspace_id?: string;
  workspace_name?: string;
  message: string;
  statusCode?: number;
}

export interface IRegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  company_name?: string;
  password: string;
}

export interface IVerifyRequest {
  verification_token: string;
}

export interface ICreatePassword {
  password: string;
  confirmed_password: string;
}
