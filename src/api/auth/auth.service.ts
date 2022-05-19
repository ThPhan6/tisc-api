import UserModel from "../../model/user.model";
import {
  IAdminLoginRequest,
  IResetPasswordRequest,
  IForgotPasswordResponse,
  IRegisterRequest,
  IForgotPasswordRequest,
} from "./auth.type";
import { IMessageResponse } from "../../type/common.type";
import { ILoginResponse } from "./auth.type";
import {
  comparePassword,
  createResetPasswordToken,
  createHash,
  createHashWithSalt,
} from "../../helper/password.helper";
import { signAdminToken, signNormalToken } from "../../helper/jwt.helper";
import { ROLES, USER_STATUSES } from "../../constant/user.constant";
import MailService from "../../service/mail.service";
import { EMAIL_TYPE, SYSTEM_MODEL } from "../../constant/common.constant";

class AuthService {
  private userModel: UserModel;
  private mailService: MailService;
  constructor() {
    this.userModel = new UserModel();
    this.mailService = new MailService();
  }

  public login = (
    payload: IAdminLoginRequest
  ): Promise<ILoginResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        email: payload.email,
      });
      if (!user) {
        return resolve({
          message: "Account does not exist",
          statusCode: 404,
        });
      }
      if (!user.is_verified) {
        return resolve({
          message: "Please verify your account first",
          statusCode: 404,
        });
      }
      if (!comparePassword(payload.password, user.password)) {
        return resolve({
          message: "Your password is not correct",
          statusCode: 400,
        });
      }
      if (user.role_id === ROLES.TISC_ADMIN)
        return resolve({
          token: signAdminToken(user.id),
          message: "success",
          statusCode: 200,
        });
      else
        return resolve({
          token: signNormalToken(user.id),
          message: "success",
          statusCode: 200,
        });
    });
  };

  public forgotPassword = (
    payload: IForgotPasswordRequest
  ): Promise<IForgotPasswordResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        email: payload.email,
        is_verified: true,
      });
      if (!user) {
        return resolve({
          message: "Account does not exist",
          statusCode: 404,
        });
      }
      let resetPasswordToken: string;
      let isDuplicated = true;
      do {
        resetPasswordToken = createResetPasswordToken();
        const duplicateResetPasswordTokenFromDb = await this.userModel.findBy({
          reset_password_token: resetPasswordToken,
        });
        if (!duplicateResetPasswordTokenFromDb) isDuplicated = false;
      } while (isDuplicated);
      const result = await this.userModel.update(user.id, {
        reset_password_token: resetPasswordToken,
      });
      if (!result) {
        return resolve({
          message: "Something wrong, please try again!",
          statusCode: 400,
        });
      }
      await this.mailService.sendResetPasswordEmail(result);
      return resolve({
        message: "success",
        statusCode: 200,
      });
    });
  };

  public resendEmail = (type: string, email: string): Promise<any> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        email,
      });
      if (!user) {
        return resolve({
          statusCode: 404,
          message: "Account does not exist",
        });
      }
      let sentEmail;
      if (type === EMAIL_TYPE.FORGOT_PASSWORD)
        sentEmail = await this.mailService.sendResetPasswordEmail(user);
      else if (type === EMAIL_TYPE.VERIFICATION)
        sentEmail = await this.mailService.sendRegisterEmail(user);
      if (sentEmail.statusCode === 200) {
        return resolve(sentEmail);
      }
      return resolve({
        statusCode: 400,
        message: "Something wrong when send email, please try again.",
      });
    });
  };

  public resetPassword = (
    payload: IResetPasswordRequest
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        reset_password_token: payload.resetPasswordToken,
        is_verified: true,
      });
      if (!user) {
        return resolve({
          message: "User not found",
          statusCode: 404,
        });
      }
      const newPassword = createHash(payload.password);
      const result = await this.userModel.update(user.id, {
        reset_password_token: null,
        password: newPassword,
      });
      if (!result) {
        return resolve({
          message: "Something wrong, please try again!",
          statusCode: 400,
        });
      }
      return resolve({
        message: "Success",
        statusCode: 200,
      });
    });
  };

  public register = (payload: IRegisterRequest): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        email: payload.email,
      });
      if (user) {
        return resolve({
          message: "Email is already used.",
          statusCode: 400,
        });
      }

      const saltHash = createHashWithSalt(payload.password);
      const password = saltHash.hash;
      let verificationToken: string;
      let isDuplicated = true;
      do {
        verificationToken = createResetPasswordToken();
        const duplicateVerificationTokenFromDb = await this.userModel.findBy({
          verification_token: verificationToken,
        });
        if (!duplicateVerificationTokenFromDb) isDuplicated = false;
      } while (isDuplicated);
      const createdUser = await this.userModel.create({
        fullname: payload.fullname,
        password,
        email: payload.email,
        role_id: ROLES.TISC_NORMAL,
        is_verified: false,
        verification_token: verificationToken,
        status: USER_STATUSES.ACTIVE,
        model: SYSTEM_MODEL.TISC,
        relation_id: "abc",
      });
      if (!createdUser) {
        return resolve({
          message: "Something wrong, please try again!",
          statusCode: 400,
        });
      }
      await this.mailService.sendRegisterEmail(createdUser);

      return resolve({
        message: "Success",
        statusCode: 200,
      });
    });
  };

  public verify = (verification_token: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        verification_token,
      });
      if (!user) {
        return resolve({
          message: "Verification link has expired",
          statusCode: 400,
        });
      }
      const updatedUser = await this.userModel.update(user.id, {
        verification_token: null,
        is_verified: true,
      });
      if (!updatedUser) {
        return resolve({
          message: "Something wrong, please try again!",
          statusCode: 400,
        });
      }
      return resolve({
        message: "Success",
        statusCode: 200,
      });
    });
  };
}

export default AuthService;
