import {
  AUTH_EMAIL_TYPE,
  BRAND_STATUSES,
  DesignFirmRoles,
  MESSAGES,
  RoleType,
} from "@/constants";
import { signJwtToken } from "@/helpers/jwt.helper";
import {
  comparePassword,
  createHash,
  createHashWithSalt,
} from "@/helpers/password.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import {
  ActiveStatus,
  BrandAttributes,
  DesignerAttributes,
  UserAttributes,
  UserStatus,
  UserType,
  UserTypeValue,
} from "@/types";
import { locationService } from "./../location/location.service";
import {
  IAdminLoginRequest,
  IForgotPasswordRequest,
  IRegisterRequest,
  IResetPasswordRequest,
} from "./auth.type";

import { permissionService } from "@/api/permission/permission.service";
import { mailService } from "@/services/mail.service";

import { ENVIRONMENT } from "@/config";
import { brandRepository } from "@/repositories/brand.repository";
import { designerRepository } from "@/repositories/designer.repository";
import { userRepository } from "@/repositories/user.repository";
import { partition, startCase } from "lodash";
import { IUserCompanyResponse } from "../user/user.type";

const errorMessage = {
  [UserType.Brand]: MESSAGES.BRAND_INACTIVE_LOGIN,
  [UserType.Designer]: MESSAGES.DESIGN_INACTIVE_LOGIN,
  [UserType.TISC]: MESSAGES.ACCOUNT_INACTIVE_LOGIN,
};

class AuthService {
  public responseWithToken = (userId: string, type?: UserType) => {
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

  private getWorkspaces = async (accounts: IUserCompanyResponse[]) => {
    const brands = await brandRepository.getMany(
      accounts.map((user) => user.relation_id)
    );

    const designers = await designerRepository.getMany(
      accounts.map((user) => user.relation_id)
    );

    return accounts
      .map((user) => {
        const workspaces = [];
        const brandWorkspace = brands.find(
          (workspace) => workspace.id === user.relation_id
        );

        const designerWorkspace = designers.find(
          (workspace) => workspace.id === user.relation_id
        );

        if (brandWorkspace) {
          workspaces.push(brandWorkspace);
        }

        if (designerWorkspace) {
          workspaces.push(designerWorkspace);
        }

        const token = this.responseWithToken(user.id, RoleType[user.role_id]);

        return workspaces.map((w) => ({
          workspace_id: w.id,
          workspace_name: w.name,
          type: token.type || user.type,
          token: token.token,
        }));
      })
      .flat();
  };

  public tiscLogin = async (payload: IAdminLoginRequest) => {
    const users = await userRepository.getAllBy({
      email: payload.email,
    });

    if (!users.length) {
      return errorMessageResponse(MESSAGES.ACCOUNT_NOT_EXIST, 404);
    }

    const [TISCUsers, otherUsers] = partition(users, { type: UserType.TISC });

    if (otherUsers.length === users.length) {
      return errorMessageResponse(MESSAGES.LOGIN_INCORRECT_TYPE);
    }

    let error: { message: string; statusCode: number } | null = null;

    const accounts = TISCUsers.map((user) => {
      if (error) return;

      const isInvalid = this.authValidation(payload.password, user);
      if (isInvalid) {
        error = isInvalid;
        return;
      }

      return user;
    }).filter(Boolean) as IUserCompanyResponse[];

    if (error) return error;

    if (!accounts.length) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const account = this.responseWithToken(
      accounts[0].id,
      RoleType[accounts[0].role_id]
    );

    return successResponse({
      data: {
        token: account.token,
        type: account.type,
      },
    });
  };

  public login = async (payload: IAdminLoginRequest) => {
    const users = await userRepository.findByCompanyIdWithCompanyStatus(
      payload.email
    );

    if (!users.length) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const [TISCUsers, otherUsers] = partition(users, {
      type: UserType.TISC,
    }) as [IUserCompanyResponse[], IUserCompanyResponse[]];

    if (TISCUsers.length === users.length) {
      return errorMessageResponse(MESSAGES.LOGIN_INCORRECT_TYPE);
    }

    const accounts: IUserCompanyResponse[] = [];
    const passwordErrors: any[] = [];
    let error: any = null;

    for (const otherUser of otherUsers) {
      const isInvalid = this.authValidation(payload.password, otherUser);

      if (isInvalid) {
        passwordErrors.push(isInvalid);
        continue;
      }

      if (error) continue;

      if (otherUser.company_status === ActiveStatus.Inactive) {
        error = errorMessageResponse(errorMessage[otherUser.type], 401);
        continue;
      }

      if (otherUser.company_status === ActiveStatus.Pending) {
        error = errorMessageResponse(MESSAGES.VERIFY_ACCOUNT_FIRST, 401);
        continue;
      }

      accounts.push(otherUser);
    }

    if (passwordErrors.length === otherUsers.length) {
      return passwordErrors[0];
    }

    if (error && (accounts.length === otherUsers.length || !accounts.length))
      return error;

    const userWorkspaces = await this.getWorkspaces(
      error ? accounts : otherUsers
    );

    if (!userWorkspaces.length) {
      return errorMessageResponse(MESSAGES.WORKSPACE_NOT_FOUND, 404);
    }

    ///
    return successResponse({ data: userWorkspaces });
  };

  public forgotPassword = async (
    payload: IForgotPasswordRequest,
    browserName: string
  ) => {
    const user = await userRepository.findBy({
      email: payload.email,
      is_verified: true,
      type: payload.type,
    });

    if (
      !user ||
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
    if (token == "") {
      return successResponse({ data: false });
    }
    return successResponse({
      data: await userRepository.checkTokenExisted(token),
    });
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

    const users = await userRepository.getAllBy({
      email: user.email,
      is_verified: true,
    });

    const [TISCUsers, otherUsers] = partition(users, {
      type: UserType.TISC,
    }) as [IUserCompanyResponse[], IUserCompanyResponse[]];

    if (TISCUsers.length && user.type === UserType.TISC) {
      const newPassword = createHash(payload.password);
      const updatedData = await userRepository.update(TISCUsers[0].id, {
        reset_password_token: null,
        password: newPassword,
      });
      if (updatedData) {
        return successMessageResponse(MESSAGES.SUCCESS);
      }
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    Promise.all(
      otherUsers.map(async (user) => {
        const newPassword = createHash(payload.password);
        await userRepository.update(user.id, {
          reset_password_token: null,
          password: newPassword,
        });
      })
    );

    return successMessageResponse(MESSAGES.SOMETHING_WRONG);
  };

  public resetPasswordAndLogin = async (payload: IResetPasswordRequest) => {
    const user = await userRepository.findBy({
      reset_password_token: payload.reset_password_token,
      is_verified: true,
    });

    if (!user) {
      return errorMessageResponse(MESSAGES.ACCOUNT_NOT_EXIST, 404);
    }

    const users = await userRepository.getAllBy({
      email: user.email,
      is_verified: true,
    });

    const [TISCUsers, otherUsers] = partition(users, {
      type: UserType.TISC,
    }) as [IUserCompanyResponse[], IUserCompanyResponse[]];

    if (TISCUsers.length && user.type === UserType.TISC) {
      const updated = await this.updateNewPassword(
        TISCUsers[0].id,
        payload.password
      );

      if (updated) {
        return this.responseWithToken(user.id);
      }

      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    Promise.all(
      otherUsers.map(
        async (otherUser) =>
          await this.updateNewPassword(otherUser.id, payload.password)
      )
    );

    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public register = async (payload: IRegisterRequest, ipAddress: string) => {
    const user = await userRepository.findBy({
      email: payload.email,
    });
    if (user) {
      return errorMessageResponse(MESSAGES.EMAIL_USED);
    }

    const createdDesign = await designerRepository.create({
      name: startCase(`${payload.firstname} company`),
    });

    if (!createdDesign) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const defaultLocation = await locationService.createDefaultLocation(
      createdDesign.id,
      UserType.Designer,
      payload.email,
      ipAddress
    );

    const token = await userRepository.generateToken("verification_token");
    const saltHash = createHashWithSalt(payload.password);
    const password = saltHash.hash;
    const [firstname, ...rest] = payload.firstname.split(" ");
    const createdUser = await userRepository.create({
      firstname: firstname || "",
      lastname: rest?.join(" ") || "",
      password,
      email: payload.email,
      role_id: DesignFirmRoles.Admin,
      verification_token:
        ENVIRONMENT.DISABLE_VERIFY_FOR_LOAD_TEST !== "1" ? token : null,
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

    const token = this.responseWithToken(user.id, user.type);

    return successResponse({
      data: {
        type: token.type,
        token: token.token,
      },
    });
  };

  public checkEmail = async (email: string) => {
    const user = await userRepository.findBy({ email });
    if (user) {
      return errorMessageResponse(MESSAGES.EMAIL_ALREADY_USED);
    }
    return successMessageResponse(MESSAGES.AVAILABLE);
  };
}
export const authService = new AuthService();
export default AuthService;
