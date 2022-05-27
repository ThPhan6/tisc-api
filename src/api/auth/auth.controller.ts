import AuthService from "./auth.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  IAdminLoginRequest,
  ICreatePassword,
  IForgotPasswordRequest,
  IRegisterRequest,
  IResetPasswordRequest,
} from "./auth.type";

export default class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  public login = async (
    req: Request & { payload: IAdminLoginRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.authService.login(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public forgotPassword = async (
    req: Request & { payload: IForgotPasswordRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.authService.forgotPassword(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public resetPassword = async (
    req: Request & { payload: IResetPasswordRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.authService.resetPassword(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public register = async (
    req: Request & { payload: IRegisterRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.authService.register(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public verify = async (req: Request, toolkit: ResponseToolkit) => {
    const { verification_token } = req.params;
    const response = await this.authService.verify(verification_token);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public createPasswordAndVerify = async (
    req: Request & { payload: ICreatePassword },
    toolkit: ResponseToolkit
  ) => {
    const { verification_token } = req.params;
    const password = req.payload.password;
    const response = await this.authService.createPasswordAndVerify(
      verification_token,
      password
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public resendEmail = async (req: Request, toolkit: ResponseToolkit) => {
    const { type, email } = req.params;
    const response = await this.authService.resendEmail(type, email);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
