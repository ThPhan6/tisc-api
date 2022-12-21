import { locationService } from "./../location/location.service";
import {
  BRAND_STATUSES,
  MESSAGES,
  AUTH_EMAIL_TYPE,
  DesignFirmRoles,
  RoleType,
} from "@/constants";
import {
  IMessageResponse,
  UserAttributes,
  ActiveStatus,
  UserType,
  UserTypeValue,
  UserStatus,
} from "@/types";
import {
  IAdminLoginRequest,
  IResetPasswordRequest,
  IRegisterRequest,
  IForgotPasswordRequest,
  ILoginResponse,
} from "./auth.type";
import {
  comparePassword,
  createHash,
  createHashWithSalt,
} from "@/helper/password.helper";
import { signJwtToken } from "@/helper/jwt.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";

import { mailService } from "@/service/mail.service";
import { permissionService } from "@/api/permission/permission.service";

import { brandRepository } from "@/repositories/brand.repository";
import { designerRepository } from "@/repositories/designer.repository";
import { userRepository } from "@/repositories/user.repository";

const errorMessage = {
  [UserType.Brand]: MESSAGES.BRAND_INACTIVE_LOGIN,
  [UserType.Designer]: MESSAGES.DESIGN_INACTIVE_LOGIN,
  [UserType.TISC]: MESSAGES.ACCOUNT_INACTIVE_LOGIN,
};

class AuthService {
  private responseWithToken = (userId: string, type?: UserType) => {
    const response = {
      type,
      token: signJwtToken(userId),
      message: MESSAGES.SUCCESS,
      statusCode: 200,
    };
    if (type) {
      return {
        ...response,
        type,
      };
    }
    return response;
  };

  private authValidation = (inputPassword: string, user: UserAttributes) => {
    if (!user.is_verified) {
      return errorMessageResponse(MESSAGES.VERIFY_ACCOUNT_FIRST);
    }
    if (user.status === UserStatus.Pending) {
      return errorMessageResponse(MESSAGES.VERIFY_ACCOUNT_FIRST);
    }
    if (user.status === UserStatus.Blocked) {
      return errorMessageResponse(MESSAGES.GENERAL.BLOCKED);
    }
    if (!comparePassword(inputPassword, user.password)) {
      return errorMessageResponse(MESSAGES.PASSWORD_NOT_CORRECT);
    }
  };

  private checkTypeValidationError = (
    expectType: UserTypeValue,
    type: UserTypeValue,
    operation: "eq" | "neq" = "eq"
  ) => {
    if (operation === "eq" && expectType !== type) {
      return errorMessageResponse(MESSAGES.LOGIN_INCORRECT_TYPE);
    }
    if (operation === "neq" && expectType === type) {
      return errorMessageResponse(MESSAGES.LOGIN_INCORRECT_TYPE);
    }
    return undefined;
  };

  private updateNewPassword = async (userId: string, password: string) => {
    return userRepository.update(userId, {
      reset_password_token: null,
      password: createHash(password),
    });
  };

  public tiscLogin = async (
    payload: IAdminLoginRequest
  ): Promise<ILoginResponse | IMessageResponse> => {
    const user = await userRepository.findBy({ email: payload.email });
    if (!user) {
      return errorMessageResponse(MESSAGES.ACCOUNT_NOT_EXIST, 404);
    }
    const isInvalid = this.authValidation(payload.password, user);
    if (isInvalid) {
      return isInvalid;
    }
    const isIncorrectType = this.checkTypeValidationError(
      UserType.TISC,
      user.type
    );
    if (isIncorrectType) {
      return isIncorrectType;
    }
    return this.responseWithToken(user.id);
  };

  public login = async (payload: IAdminLoginRequest) => {
    ///
    const user = await userRepository.findByCompanyIdWithCompanyStatus(
      payload.email
    );
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const isInvalid = this.authValidation(payload.password, user);
    if (isInvalid) {
      return isInvalid;
    }

    const isIncorrectType = this.checkTypeValidationError(
      UserType.TISC,
      user.type,
      "neq"
    );
    if (isIncorrectType) {
      return isIncorrectType;
    }

    //// company status validation
    if (user.company_status === ActiveStatus.Inactive) {
      return errorMessageResponse(errorMessage[user.type], 401);
    }
    if (user.company_status === ActiveStatus.Pending) {
      return errorMessageResponse(MESSAGES.VERIFY_ACCOUNT_FIRST, 401);
    }
    ///
    return this.responseWithToken(user.id, RoleType[user.role_id]);
  };

  public forgotPassword = async (
    payload: IForgotPasswordRequest,
    browserName: string
  ) => {
    const user = await userRepository.findBy({
      email: payload.email,
      is_verified: true,
    });
    if (!user) {
      return errorMessageResponse(MESSAGES.ACCOUNT_NOT_EXIST, 404);
    }
    if (
      (payload.type === UserType.TISC && user.type !== UserType.TISC) ||
      (payload.type !== UserType.TISC && user.type === UserType.TISC)
    ) {
      return errorMessageResponse(MESSAGES.ACCOUNT_NOT_EXIST, 404);
    }
    const token = await userRepository.generateToken("reset_password_token");
    const updatedData = await userRepository.update(user.id, {
      reset_password_token: token,
    });
    if (updatedData === false) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG, 404);
    }
    /// send reset password
    await mailService.sendResetPasswordEmail(updatedData, browserName);
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public checkTokenExisted = async (token: string) => {
    if (token == '') {
      return successResponse({ data: false });
    }
    return successResponse({ data: await userRepository.checkTokenExisted(token) });
  };

  public resendEmail = async (
    type: string,
    email: string,
    browserName: string
  ) => {
    const user = await userRepository.getResendEmail(email);
    if (!user) {
      return errorMessageResponse(MESSAGES.ACCOUNT_NOT_EXIST, 404);
    }
    let isSuccess = false;
    if (type === AUTH_EMAIL_TYPE.FORGOT_PASSWORD) {
      isSuccess = await mailService.sendResetPasswordEmail(user, browserName);
    }
    if (type === AUTH_EMAIL_TYPE.VERIFICATION) {
      isSuccess = await mailService.sendRegisterEmail(user);
    }
    if (isSuccess) {
      return successResponse();
    }
    return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
  };

  public resetPassword = async (payload: IResetPasswordRequest) => {
    const user = await userRepository.findBy({
      reset_password_token: payload.reset_password_token,
      is_verified: true,
    });
    if (!user) {
      return errorMessageResponse(MESSAGES.ACCOUNT_NOT_EXIST, 404);
    }
    const newPassword = createHash(payload.password);
    const updatedData = await userRepository.update(user.id, {
      reset_password_token: null,
      password: newPassword,
    });
    if (updatedData) {
      return successMessageResponse(MESSAGES.SUCCESS);
    }
    return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
  };

  public resetPasswordAndLogin = async (payload: IResetPasswordRequest) => {
    const user = await userRepository.findBy({
      reset_password_token: payload.reset_password_token,
      is_verified: true,
    });

    if (!user) {
      return errorMessageResponse(MESSAGES.ACCOUNT_NOT_EXIST, 404);
    }
    const updated = await this.updateNewPassword(user.id, payload.password);
    if (updated) {
      return this.responseWithToken(user.id);
    }
    return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
  };

  public register = async (payload: IRegisterRequest) => {
    const user = await userRepository.findBy({
      email: payload.email,
    });
    if (user) {
      return errorMessageResponse(MESSAGES.EMAIL_USED);
    }

    const createdDesign = await designerRepository.create({
      name: payload.company_name || payload.firstname,
    });

    if (!createdDesign) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const defaultLocation = await locationService.createDefaultLocation(
      createdDesign.id,
      UserType.Designer,
      payload.email
    );

    const token = await userRepository.generateToken("verification_token");
    const saltHash = createHashWithSalt(payload.password);
    const password = saltHash.hash;

    const createdUser = await userRepository.create({
      firstname: payload.firstname ?? "",
      lastname: payload.lastname ?? "",
      password,
      email: payload.email,
      role_id: DesignFirmRoles.Admin,
      verification_token: token,
      type: UserType.Designer,
      relation_id: createdDesign.id ?? null,
      location_id: defaultLocation?.id,
    });
    if (!createdUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    await permissionService.initPermission(createdUser);
    await mailService.sendRegisterEmail(createdUser);
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public verify = async (verification_token: string) => {
    const user = await userRepository.findBy({ verification_token });
    if (!user) {
      return errorMessageResponse(MESSAGES.VERIFICATION_LINK_HAS_EXPIRED);
    }
    const updatedUser = await userRepository.update(user.id, {
      verification_token: null,
      is_verified: true,
      status: UserStatus.Active,
    });
    if (!updatedUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public createPasswordAndVerify = async (
    verification_token: string,
    password: string
  ) => {
    const user = await userRepository.findBy({ verification_token });
    if (!user) {
      return errorMessageResponse(MESSAGES.VERIFICATION_LINK_HAS_EXPIRED);
    }
    const saltHash = createHashWithSalt(password);
    const updatedUser = await userRepository.update(user.id, {
      verification_token: null,
      is_verified: true,
      password: saltHash.hash,
      status: UserStatus.Active,
    });

    if (!updatedUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }
    // update brand status after verify the first brand admin
    if (user.type === UserType.Brand && user.relation_id) {
      await brandRepository.update(user.relation_id, {
        status: BRAND_STATUSES.ACTIVE,
      });
    }
    return this.responseWithToken(user.id, user.type);
  };

  public checkEmail = async (email: string) => {
    const user = await userRepository.findBy({ email });
    if (user) {
      return errorMessageResponse(MESSAGES.EMAIL_ALREADY_USED);
    }
    return successMessageResponse(MESSAGES.AVAILABLE);
  };
}

export default AuthService;
