import AuthService from "./auth.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  IAdminLoginRequest,
  ICreatePassword,
  IForgotPasswordRequest,
  IRegisterRequest,
  IResetPasswordRequest,
} from "./auth.type";
import { upsertBlockedIp } from "@/helpers/blocked_ip.helper";

export default class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  public login = async (
    req: Request & { payload: IAdminLoginRequest },
    toolkit: ResponseToolkit
  ) => {
    const response = await this.authService.tiscLogin(req.payload);
    await upsertBlockedIp(req, response.statusCode || 400);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public brandLogin = async (
    req: Request & { payload: IAdminLoginRequest },
    toolkit: ResponseToolkit
  ) => {
    const response = await this.authService.login(req.payload);
    await upsertBlockedIp(req, response.statusCode || 400);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public forgotPassword = async (
    req: Request & { payload: IForgotPasswordRequest },
    toolkit: ResponseToolkit
  ) => {
    const currentBrowser = req.headers["user-agent"];
    const payload = req.payload;
    const response = await this.authService.forgotPassword(
      payload,
      currentBrowser
    );
    await upsertBlockedIp(req, response.statusCode || 400);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public resetPassword = async (
    req: Request & { payload: IResetPasswordRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.authService.resetPassword(payload);
    await upsertBlockedIp(req, response.statusCode || 400);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public resetPasswordAndLogin = async (
    req: Request & { payload: IResetPasswordRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.authService.resetPasswordAndLogin(payload);
    await upsertBlockedIp(req, response.statusCode || 400);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public register = async (
    req: Request & { payload: IRegisterRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const ipAddress = req.headers["x-forwarded-for"] || req.info.remoteAddress;
    const response = await this.authService.register(payload, ipAddress);
    await upsertBlockedIp(req, response.statusCode || 400);
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
    await upsertBlockedIp(req, response.statusCode || 400);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public resendEmail = async (req: Request, toolkit: ResponseToolkit) => {
    const currentBrowser = req.headers["user-agent"];
    const { type, email } = req.params;
    const response = await this.authService.resendEmail(
      type,
      email,
      currentBrowser
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public checkTokenExisted = async (req: Request, toolkit: ResponseToolkit) => {
    const { token } = req.params;
    const response = await this.authService.checkTokenExisted(token);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public checkEmail = async (req: Request, toolkit: ResponseToolkit) => {
    const { email } = req.params;
    const response = await this.authService.checkEmail(email);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
