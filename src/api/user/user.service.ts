import { MESSAGES, SYSTEM_TYPE } from "./../../constant/common.constant";
import { IMessageResponse } from "../../type/common.type";
import UserModel, {
  IUserAttributes,
  USER_NULL_ATTRIBUTES,
} from "../../model/user.model";
import MailService from "../../service/mail.service";
import { IUserRequest, IUserResponse } from "./user.type";
import { createResetPasswordToken } from "../../helper/password.helper";
import { USER_STATUSES } from "../../constant/user.constant";
import { VALID_AVATAR_TYPES } from "../../constant/common.constant";
import path from "path";
import fs from "fs";
import { upload } from "../../service/aws.service";

export default class UserService {
  private userModel: UserModel;
  private mailService: MailService;
  constructor() {
    this.userModel = new UserModel();
    this.mailService = new MailService();
  }

  public create = (
    user_id: string,
    payload: IUserRequest
  ): Promise<IMessageResponse> => {
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
      const adminUser = await this.userModel.find(user_id);
      if (!adminUser) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
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
        gender: payload.gender,
        location_id: payload.location_id,
        department: payload.department,
        position: payload.position,
        email: payload.email,
        phone: payload.phone,
        mobile: payload.mobile,
        role_id: payload.role_id,
        is_verified: false,
        verification_token: verificationToken,
        status: USER_STATUSES.PENDING,
        type: adminUser.type,
        relation_id: adminUser.relation_id,
      });
      if (!createdUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      await this.mailService.sendInviteEmail(createdUser);
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };

  public get = (
    user_id: string,
    current_user_id?: string
  ): Promise<IUserResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (current_user_id) {
        const currentUser = await this.userModel.find(current_user_id);
        if (!currentUser) {
          return resolve({
            message: MESSAGES.CURRENT_USER_NOT_FOUND,
            statusCode: 404,
          });
        }
        if (
          currentUser.type !== user.type ||
          currentUser.relation_id !== user.relation_id
        ) {
          return resolve({
            message: MESSAGES.USER_IN_WORKSPACE_NOT_FOUND,
            statusCode: 400,
          });
        }
      }
      const result = {
        firstname: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        location: user.location_id,
        position: user.position,
        email: user.email,
        phone: user.phone,
        mobile: user.mobile,
        avatar: user.avatar,
        backup_email: user.backup_email,
        personal_mobile: user.personal_mobile,
        linkedin: user.linkedin,
      };
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };

  public update = (
    user_id: string,
    payload: IUserRequest,
    current_user_id?: string
  ): Promise<IUserResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);

      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (current_user_id) {
        const currentUser = await this.userModel.find(current_user_id);
        if (!currentUser) {
          return resolve({
            message: MESSAGES.CURRENT_USER_NOT_FOUND,
            statusCode: 404,
          });
        }
        if (
          currentUser.type !== user.type ||
          currentUser.relation_id !== user.relation_id
        ) {
          return resolve({
            message: MESSAGES.USER_IN_WORKSPACE_NOT_FOUND,
            statusCode: 400,
          });
        }
      }
      const updatedUser = await this.userModel.update(user_id, payload);
      if (!updatedUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const result = {
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        gender: updatedUser.gender,
        location: updatedUser.location_id,
        position: updatedUser.position,
        email: updatedUser.email,
        phone: updatedUser.phone,
        mobile: updatedUser.mobile,
        avatar: updatedUser.avatar,
        backup_email: updatedUser.backup_email,
        personal_mobile: updatedUser.personal_mobile,
        linkedin: updatedUser.linkedin,
      };
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public delete = (
    user_id: string,
    current_user_id: string
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);

      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const currentUser = await this.userModel.find(current_user_id);
      if (!currentUser) {
        return resolve({
          message: MESSAGES.CURRENT_USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (
        currentUser.type !== user.type ||
        currentUser.relation_id !== user.relation_id
      ) {
        return resolve({
          message: MESSAGES.USER_IN_WORKSPACE_NOT_FOUND,
          statusCode: 400,
        });
      }
      const updatedUser = await this.userModel.update(user_id, {
        is_deleted: true,
      });
      if (!updatedUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
  public updateAvatar = (
    user_id: string,
    avatar: any
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);

      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }

      if (!avatar._data) {
        return resolve({
          message: MESSAGES.AVATAR_NOT_VALID_FILE,
          statusCode: 400,
        });
      }
      if (
        !VALID_AVATAR_TYPES.find(
          (item) => item === avatar.hapi.headers["content-type"]
        )
      ) {
        return resolve({
          message: MESSAGES.AVATAR_NOT_VALID_FILE,
          statusCode: 400,
        });
      }
      const uploadedData = await upload(
        Buffer.from(avatar._data),
        "avatar/" + avatar.hapi.filename,
        avatar.hapi.headers["content-type"]
      );
      if (!uploadedData) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }

      await this.userModel.update(user_id, {
        avatar: "/avatar/" + avatar.hapi.filename,
      });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
  public getList = (
    user_id: string,
    limit: number,
    offset: number,
    filter?: any,
    sort?: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const users: IUserAttributes[] = await this.userModel.list(
        limit,
        offset,
        { ...filter, type: SYSTEM_TYPE.TISC, relation_id: null },
        sort
      );
      const result = users.map((user) => {
        return {
          firstname: user.firstname,
          lastname: user.lastname,
          gender: user.gender,
          location: user.location_id,
          position: user.position,
          email: user.email,
          phone: user.phone,
          mobile: user.mobile,
          avatar: user.avatar,
          backup_email: user.backup_email,
          personal_mobile: user.personal_mobile,
          linkedin: user.linkedin,
        };
      });
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
}
