import { MESSAGES } from "./../../constant/common.constant";
import UserModel, { USER_NULL_ATTRIBUTES } from "../../model/user.model";
import {
  IAdminLoginRequest,
  IResetPasswordRequest,
  IForgotPasswordResponse,
  IRegisterRequest,
  IForgotPasswordRequest,
  ILoginResponse,
} from "./auth.type";
import { IMessageResponse } from "../../type/common.type";
import {
  comparePassword,
  createResetPasswordToken,
  createHash,
  createHashWithSalt,
} from "../../helper/password.helper";
import {
  signAdminToken,
  signBrandAdminToken,
  signBrandTeamToken,
  signConsultantTeamToken,
  signDesignAdminToken,
  signDesignTeamToken,
} from "../../helper/jwt.helper";
import { ROLES, USER_STATUSES } from "../../constant/user.constant";
import MailService from "../../service/mail.service";
import { EMAIL_TYPE, SYSTEM_TYPE } from "../../constant/common.constant";

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
          message: MESSAGES.ACCOUNT_NOT_EXIST,
          statusCode: 404,
        });
      }
      if (!user.is_verified) {
        return resolve({
          message: MESSAGES.VERIFY_ACCOUNT_FIRST,
          statusCode: 404,
        });
      }
      if (!comparePassword(payload.password, user.password || "")) {
        return resolve({
          message: MESSAGES.PASSWORD_NOT_CORRECT,
          statusCode: 400,
        });
      }
      if (user.role_id === ROLES.TISC_ADMIN) {
        return resolve({
          token: signAdminToken(user.id),
          message: MESSAGES.SUCCESS,
          statusCode: 200,
        });
      }
      if (user.role_id === ROLES.TISC_CONSULTANT_TEAM) {
        return resolve({
          token: signConsultantTeamToken(user.id),
          message: MESSAGES.SUCCESS,
          statusCode: 200,
        });
      }
      if (user.role_id === ROLES.BRAND_ADMIN) {
        return resolve({
          token: signBrandAdminToken(user.id),
          message: MESSAGES.SUCCESS,
          statusCode: 200,
        });
      }
      if (user.role_id === ROLES.BRAND_TEAM) {
        return resolve({
          token: signBrandTeamToken(user.id),
          message: MESSAGES.SUCCESS,
          statusCode: 200,
        });
      }
      if (user.role_id === ROLES.DESIGN_ADMIN) {
        return resolve({
          token: signDesignAdminToken(user.id),
          message: MESSAGES.SUCCESS,
          statusCode: 200,
        });
      }
      if (user.role_id === ROLES.DESIGN_TEAM) {
        return resolve({
          token: signDesignTeamToken(user.id),
          message: MESSAGES.SUCCESS,
          statusCode: 200,
        });
      }
      return resolve({
        message: MESSAGES.USER_ROLE_NOT_FOUND,
        statusCode: 404,
      });
    });
  };

  public forgotPassword = (
    payload: IForgotPasswordRequest,
    browserName: string
  ): Promise<IForgotPasswordResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        email: payload.email,
        is_verified: true,
      });
      if (!user) {
        return resolve({
          message: MESSAGES.ACCOUNT_NOT_EXIST,
          statusCode: 404,
        });
      }
      let reset_password_token: string;
      let isDuplicated = true;
      do {
        reset_password_token = createResetPasswordToken();
        const duplicateResetPasswordTokenFromDb = await this.userModel.findBy({
          reset_password_token: reset_password_token,
        });
        if (!duplicateResetPasswordTokenFromDb) isDuplicated = false;
      } while (isDuplicated);
      const result = await this.userModel.update(user.id, {
        reset_password_token: reset_password_token,
      });
      if (!result) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      await this.mailService.sendResetPasswordEmail(result, browserName);
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
  public isValidResetPasswordToken = (
    token: string
  ): Promise<{ data: boolean; statusCode: number }> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        reset_password_token: token,
        is_verified: true,
      });
      if (!user) {
        return resolve({
          data: false,
          statusCode: 200,
        });
      }
      return resolve({
        data: true,
        statusCode: 200,
      });
    });

  public resendEmail = (
    type: string,
    email: string,
    browserName: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        email,
      });
      if (!user) {
        return resolve({
          statusCode: 404,
          message: MESSAGES.ACCOUNT_NOT_EXIST,
        });
      }
      let sentEmail;
      if (type === EMAIL_TYPE.FORGOT_PASSWORD)
        sentEmail = await this.mailService.sendResetPasswordEmail(
          user,
          browserName
        );
      else if (type === EMAIL_TYPE.VERIFICATION)
        sentEmail = await this.mailService.sendRegisterEmail(user);
      if (sentEmail) {
        return resolve(sentEmail);
      }
      return resolve({
        statusCode: 400,
        message: MESSAGES.SEND_EMAIL_WRONG,
      });
    });
  };

  public resetPassword = (
    payload: IResetPasswordRequest
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        reset_password_token: payload.reset_password_token,
        is_verified: true,
      });
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
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
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };

  public resetPasswordAndLogin = (
    payload: IResetPasswordRequest
  ): Promise<ILoginResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        reset_password_token: payload.reset_password_token,
        is_verified: true,
      });
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const newPassword = createHash(payload.password);
      const updated = await this.userModel.update(user.id, {
        reset_password_token: null,
        password: newPassword,
      });
      if (!updated) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      return resolve(
        await this.login({
          email: user.email,
          password: payload.password,
        })
      );
    });
  };

  public register = (payload: IRegisterRequest): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        email: payload.email,
      });
      if (user) {
        return resolve({
          message: MESSAGES.EMAIL_USED,
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
        ...USER_NULL_ATTRIBUTES,
        firstname: payload.firstname,
        lastname: payload.lastname,
        password,
        email: payload.email,
        role_id: ROLES.TISC_CONSULTANT_TEAM,
        is_verified: false,
        access_level: "Consultant Team",
        verification_token: verificationToken,
        status: USER_STATUSES.ACTIVE,
        type: SYSTEM_TYPE.TISC,
      });
      if (!createdUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      await this.mailService.sendRegisterEmail(createdUser);

      return resolve({
        message: MESSAGES.SUCCESS,
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
          message: MESSAGES.VERIFICATION_LINK_HAS_EXPIRED,
          statusCode: 400,
        });
      }
      const updatedUser = await this.userModel.update(user.id, {
        verification_token: null,
        is_verified: true,
      });
      if (!updatedUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };

  public createPasswordAndVerify = (
    verification_token: string,
    password: string
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        verification_token,
      });
      if (!user) {
        return resolve({
          message: MESSAGES.VERIFICATION_LINK_HAS_EXPIRED,
          statusCode: 400,
        });
      }
      const saltHash = createHashWithSalt(password);
      const updatedUser = await this.userModel.update(user.id, {
        verification_token: null,
        is_verified: true,
        password: saltHash.hash,
        status: USER_STATUSES.ACTIVE,
      });
      if (!updatedUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
}

export default AuthService;
