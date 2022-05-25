export interface IAdminLoginRequest {
  email: string;
  password: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  resetPasswordToken: string;
  password: string;
  confirmedPassword: string;
}

export interface IForgotPasswordResponse {
  resetPasswordToken: string;
  message: string;
  statusCode?: number;
}

export interface ILoginResponse {
  token: string;
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
