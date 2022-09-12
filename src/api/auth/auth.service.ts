import {
  BRAND_STATUSES,
  DESIGN_STATUSES,
  MESSAGES,
  EMAIL_TYPE, SYSTEM_TYPE,
} from "./../../constant/common.constant";
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
  signJwtToken,
} from "../../helper/jwt.helper";
import { ROLES, USER_STATUSES } from "../../constant/user.constant";
import MailService from "../../service/mail.service";
import BrandModel from "../../model/brand.model";
import { getAccessLevel } from "../../helper/common.helper";
import DesignModel, {
  DESIGN_NULL_ATTRIBUTES,
} from "../../model/designer.model";
import PermissionService from "../permission/permission.service";
import {getRoleType} from '@/constant/role.constant';

class AuthService {
  private userModel: UserModel;
  private mailService: MailService;
  private brandModel: BrandModel;
  private designModel: DesignModel;
  private permissionService: PermissionService;
  constructor() {
    this.userModel = new UserModel();
    this.mailService = new MailService();
    this.brandModel = new BrandModel();
    this.designModel = new DesignModel();
    this.permissionService = new PermissionService();
  }

  private findBrandOrDesignInactive = async (
    type: number,
    relation_id: string
  ) => {
    if (type === SYSTEM_TYPE.BRAND) {
      const foundBrand = await this.brandModel.find(relation_id);
      if (foundBrand && foundBrand.status === BRAND_STATUSES.INACTIVE)
        return MESSAGES.BRAND_INACTIVE_LOGIN;
    } else {
      const foundDesign = await this.designModel.find(relation_id);
      if (foundDesign && foundDesign.status === DESIGN_STATUSES.INACTIVE) {
        return MESSAGES.DESIGN_INACTIVE_LOGIN;
      }
    }
    return false;
  };

  private reponseWithToken = (userId: string, type?: string) => {
    const response = {
      token: signJwtToken(userId),
      message: MESSAGES.SUCCESS,
      statusCode: 200,
    }
    if (type) {
      return {
        ...response,
        type
      }
    }
    return response;
  }


  public tiscLogin = (
    payload: IAdminLoginRequest,
    type?: number
  ): Promise<ILoginResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      if (type && type !== SYSTEM_TYPE.TISC) {
        return resolve({
          message: MESSAGES.LOGIN_INCORRECT_TYPE,
          statusCode: 400,
        });
      }
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

      return resolve(this.reponseWithToken(user.id));
    });
  };
  public login = (
    payload: IAdminLoginRequest,
    type?: number
  ): Promise<ILoginResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      if (type && type === SYSTEM_TYPE.TISC) {
        return resolve({
          message: MESSAGES.LOGIN_INCORRECT_TYPE,
          statusCode: 400,
        });
      }
      const user = await this.userModel.findBy({
        email: payload.email,
      });
      if (!user) {
        return resolve({
          message: MESSAGES.ACCOUNT_NOT_EXIST,
          statusCode: 404,
        });
      }
      const brandOrDesignInactive = await this.findBrandOrDesignInactive(
        user.type,
        user?.relation_id || ""
      );
      if (brandOrDesignInactive) {
        return resolve({
          message: brandOrDesignInactive,
          statusCode: 401,
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
      return resolve(
        this.reponseWithToken(user.id, getRoleType(user.role_id)),
      );
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
      if (
        (
          payload.type === SYSTEM_TYPE.TISC &&
          user.type !== SYSTEM_TYPE.TISC
        ) ||
        (
          payload.type !== SYSTEM_TYPE.TISC &&
          user.type === SYSTEM_TYPE.TISC
        )
      ) {
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
      if (user.type === SYSTEM_TYPE.TISC) {
        return resolve(
          await this.tiscLogin({
            email: user.email,
            password: payload.password,
          }, user.type)
        );
      }
      return resolve(
        await this.login({
          email: user.email,
          password: payload.password,
        }, user.type)
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
      //create design firm
      // let createdDesign;
      // const lastDeletedDesign = await this.designModel.getLastDeleted(
      //   payload.email
      // );
      // if (lastDeletedDesign !== false) {
      //   createdDesign = await this.designModel.create({
      //     ...DESIGN_NULL_ATTRIBUTES,
      //     name: lastDeletedDesign.name,
      //     parent_company: lastDeletedDesign.parent_company,
      //     logo: lastDeletedDesign.logo,
      //     slogan: lastDeletedDesign.slogan,
      //     profile_n_philosophy: lastDeletedDesign.profile_n_philosophy,
      //     official_website: lastDeletedDesign.official_website,
      //     design_capabilities: lastDeletedDesign.design_capabilities,
      //     team_profile_ids: lastDeletedDesign.team_profile_ids,
      //     location_ids: lastDeletedDesign.location_ids,
      //     material_code_ids: lastDeletedDesign.material_code_ids,
      //     project_ids: lastDeletedDesign.project_ids,
      //     status: DESIGN_STATUSES.ACTIVE,
      //   });
      // } else {
      const createdDesign = await this.designModel.create({
        ...DESIGN_NULL_ATTRIBUTES,
        name: payload.company_name || payload.firstname + " Design Firm",
        status: DESIGN_STATUSES.ACTIVE,
      });
      // }
      if (!createdDesign) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
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
        role_id: ROLES.DESIGN_ADMIN,
        is_verified: false,
        access_level: getAccessLevel(ROLES.DESIGN_ADMIN),
        verification_token: verificationToken,
        status: USER_STATUSES.PENDING,
        type: SYSTEM_TYPE.DESIGN,
        relation_id: createdDesign.id,
        retrieve_favourite: false,
      });
      if (!createdUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      await this.permissionService.createDesignPermission(createdDesign.id);
      await this.mailService.sendDesignRegisterEmail(createdUser);
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
      // update brand status after verify the first brand admin
      if (user.type === SYSTEM_TYPE.BRAND && user.relation_id) {
        const brand = await this.brandModel.find(user.relation_id);
        if (brand && brand.status === BRAND_STATUSES.PENDING) {
          await this.brandModel.update(brand.id, {
            status: BRAND_STATUSES.ACTIVE,
          });
        }
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
  public checkEmail = (email: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.findBy({
        email,
      });
      if (user) {
        return resolve({
          message: MESSAGES.EMAIL_ALREADY_USED,
          statusCode: 400,
        });
      }

      return resolve({
        message: MESSAGES.AVAILABLE,
        statusCode: 200,
      });
    });
  };
}

export default AuthService;
