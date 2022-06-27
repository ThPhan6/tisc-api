import { MESSAGES, SYSTEM_TYPE } from "./../../constant/common.constant";
import { IMessageResponse, IPagination } from "../../type/common.type";
import UserModel, {
  IUserAttributes,
  USER_NULL_ATTRIBUTES,
} from "../../model/user.model";
import MailService from "../../service/mail.service";
import {
  IAvatarResponse,
  IUpdateMeRequest,
  IUserRequest,
  IUserResponse,
  IDepartmentsResponse,
} from "./user.type";
import { createResetPasswordToken } from "../../helper/password.helper";
import { USER_STATUSES } from "../../constant/user.constant";
import { VALID_IMAGE_TYPES } from "../../constant/common.constant";
import { upload, deleteFile } from "../../service/aws.service";
import moment from "moment";
import { toWebp } from "../../helper/image.helper";
import DepartmentModel from "../../model/department.model";

export default class UserService {
  private userModel: UserModel;
  private mailService: MailService;
  private departmentModel: DepartmentModel;
  constructor() {
    this.userModel = new UserModel();
    this.mailService = new MailService();
    this.departmentModel = new DepartmentModel();
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
        department_id: payload.department_id,
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
        location_id: user.location_id,
        department_id: user.department_id,
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
        location_id: updatedUser.location_id,
        department_id: updatedUser.department_id,
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
  public updateMe = (
    user_id: string,
    payload: IUpdateMeRequest
  ): Promise<IUserResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);

      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedUser = await this.userModel.update(user_id, {
        backup_email: payload.backup_email,
        personal_mobile:
          (payload.zone_code || "") + " " + payload.personal_mobile,
        linkedin: payload.linkedin,
      });
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
        location_id: updatedUser.location_id,
        department_id: updatedUser.department_id,
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
  ): Promise<IMessageResponse | IAvatarResponse> => {
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
        !VALID_IMAGE_TYPES.find(
          (item) => item === avatar.hapi.headers["content-type"]
        )
      ) {
        return resolve({
          message: MESSAGES.AVATAR_NOT_VALID_FILE,
          statusCode: 400,
        });
      }
      const fileNameParts = avatar.hapi.filename.split(".");
      const fileName = fileNameParts[0] + "_" + moment();
      const newFileName = fileName + "." + fileNameParts[1];
      if (user.avatar) {
        const urlParts = user.avatar.split("/");
        const oldNameParts = urlParts[2].split(".");
        await deleteFile(user.avatar.slice(1));
        await deleteFile("avatar/" + oldNameParts[0] + "_large.webp");
        await deleteFile("avatar/" + oldNameParts[0] + "_medium.webp");
        await deleteFile("avatar/" + oldNameParts[0] + "_small.webp");
        await deleteFile("avatar/" + oldNameParts[0] + "_thumbnail.webp");
      }
      const uploadedData = await upload(
        Buffer.from(avatar._data),
        "avatar/" + newFileName,
        avatar.hapi.headers["content-type"]
      );
      //upload 4 size webp
      const largeBuffer = await toWebp(Buffer.from(avatar._data), "large");
      await upload(
        largeBuffer,
        "avatar/" + fileName + "_large.webp",
        "image/webp"
      );
      const mediumBuffer = await toWebp(Buffer.from(avatar._data), "medium");
      await upload(
        mediumBuffer,
        "avatar/" + fileName + "_medium.webp",
        "image/webp"
      );
      const smallBuffer = await toWebp(Buffer.from(avatar._data), "small");
      await upload(
        smallBuffer,
        "avatar/" + fileName + "_small.webp",
        "image/webp"
      );
      const thumbnailBuffer = await toWebp(
        Buffer.from(avatar._data),
        "thumbnail"
      );
      await upload(
        thumbnailBuffer,
        "avatar/" + fileName + "_thumbnail.webp",
        "image/webp"
      );
      if (!uploadedData) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }

      await this.userModel.update(user_id, {
        avatar: "/avatar/" + newFileName,
      });
      return resolve({
        data: {
          url: "/avatar/" + newFileName,
        },
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
      const result = users.map((userItem) => {
        return {
          firstname: userItem.firstname,
          lastname: userItem.lastname,
          gender: userItem.gender,
          location: userItem.location_id,
          position: userItem.position,
          email: userItem.email,
          phone: userItem.phone,
          mobile: userItem.mobile,
          avatar: userItem.avatar,
          backup_email: userItem.backup_email,
          personal_mobile: userItem.personal_mobile,
          linkedin: userItem.linkedin,
        };
      });
      const pagination: IPagination = await this.userModel.getPagination(
        limit,
        offset
      );

      return resolve({
        data: {
          users: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  };
  public getListDepartment = (): Promise<IDepartmentsResponse> =>
    new Promise(async (resolve) => {
      const departments = await this.departmentModel.getAll(
        ["id", "name"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: departments,
        statusCode: 200,
      });
    });
}
