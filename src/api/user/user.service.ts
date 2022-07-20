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
  IUsersResponse,
} from "./user.type";
import { createResetPasswordToken } from "../../helper/password.helper";
import { USER_STATUSES } from "../../constant/user.constant";
import { VALID_IMAGE_TYPES } from "../../constant/common.constant";
import { upload, deleteFile } from "../../service/aws.service";
import moment from "moment";
import { toWebp } from "../../helper/image.helper";
import DepartmentModel, {
  DEPARTMENT_NULL_ATTRIBUTES,
} from "../../model/department.model";
import LocationModel from "../../model/location.model";
import { getAccessLevel } from "../../helper/common.helper";
import PermissionService from "../../api/permission/permission.service";
import BrandModel from "../../model/brand.model";

export default class UserService {
  private userModel: UserModel;
  private mailService: MailService;
  private departmentModel: DepartmentModel;
  private locationModel: LocationModel;
  private permissionService: PermissionService;
  private brandModel: BrandModel;
  constructor() {
    this.userModel = new UserModel();
    this.mailService = new MailService();
    this.departmentModel = new DepartmentModel();
    this.locationModel = new LocationModel();
    this.permissionService = new PermissionService();
    this.brandModel = new BrandModel();
  }

  public create = (
    user_id: string,
    payload: IUserRequest
  ): Promise<IUserResponse | IMessageResponse> => {
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
      const currentUser = await this.userModel.find(user_id);
      if (!currentUser) {
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
      const location = await this.locationModel.find(payload.location_id);
      const department = await this.departmentModel.find(payload.department_id);
      if (!department) {
        const createdDepartment = await this.departmentModel.create({
          ...DEPARTMENT_NULL_ATTRIBUTES,
          name: payload.department_id,
          type: currentUser.type,
          relation_id: currentUser.relation_id,
        });
        if (createdDepartment) payload.department_id = createdDepartment.id;
      }
      const createdUser = await this.userModel.create({
        ...USER_NULL_ATTRIBUTES,
        firstname: payload.firstname,
        lastname: payload.lastname,
        gender: payload.gender,
        location_id: payload.location_id,
        work_location: location?.city_name + ", " + location?.country_name,
        department_id: payload.department_id,
        position: payload.position,
        email: payload.email,
        phone: payload.phone,
        mobile: payload.mobile,
        role_id: payload.role_id,
        access_level: getAccessLevel(payload.role_id),
        is_verified: false,
        verification_token: verificationToken,
        status: USER_STATUSES.PENDING,
        type: currentUser.type,
        relation_id: currentUser.relation_id,
      });
      if (!createdUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      await this.mailService.sendInviteEmail(createdUser);
      return resolve(await this.get(createdUser.id, user_id));
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
            message: MESSAGES.USER_NOT_IN_WORKSPACE,
            statusCode: 400,
          });
        }
      }
      const location = await this.locationModel.find(user.location_id || "");
      const permissions = current_user_id
        ? undefined
        : await this.permissionService.getList(user_id);
      const result = {
        id: user.id,
        role_id: user.role_id,
        firstname: user.firstname,
        lastname: user.lastname,
        fullname: `${user.firstname} ${user.lastname}`,
        gender: user.gender,
        location_id: user.location_id,
        work_location: location?.city_name + ", " + location?.country_name,
        department_id: user.department_id,
        position: user.position,
        email: user.email,
        phone: user.phone,
        mobile: user.mobile,
        avatar: user.avatar,
        backup_email: user.backup_email,
        personal_mobile: user.personal_mobile,
        linkedin: user.linkedin,
        created_at: user.created_at,
        access_level: user.access_level,
        status: user.status,
        type: user.type,
        relation_id: user.relation_id,
        phone_code: location?.phone_code,
        permissions,
      };
      if (user.type === SYSTEM_TYPE.BRAND) {
        const brand = await this.brandModel.find(user.relation_id || "");
        return resolve({
          data: { ...result, brand },
          statusCode: 200,
        });
      }
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
            message: MESSAGES.USER_NOT_IN_WORKSPACE,
            statusCode: 400,
          });
        }
        const department = await this.departmentModel.find(
          payload.department_id
        );
        if (!department) {
          const createdDepartment = await this.departmentModel.create({
            ...DEPARTMENT_NULL_ATTRIBUTES,
            name: payload.department_id,
            type: currentUser.type,
            relation_id: currentUser.relation_id,
          });
          if (createdDepartment) payload.department_id = createdDepartment.id;
        }
      }
      let additionalPayload = {};
      if (payload.location_id && user.location_id !== payload.location_id) {
        const location = await this.locationModel.find(payload.location_id);
        additionalPayload = {
          work_location: location?.city_name + ", " + location?.country_name,
        };
      }
      if (payload.role_id && user.role_id !== payload.role_id) {
        additionalPayload = {
          ...additionalPayload,
          access_level: getAccessLevel(payload.role_id),
        };
      }
      const updatedUser = await this.userModel.update(user_id, {
        ...payload,
        ...additionalPayload,
      });
      if (!updatedUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(updatedUser.id, user_id));
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
        personal_mobile: payload.personal_mobile,
        linkedin: payload.linkedin,
      });
      if (!updatedUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(updatedUser.id, user_id));
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
          message: MESSAGES.USER_NOT_IN_WORKSPACE,
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
          message: MESSAGES.AVATAR_NOT_VALID,
          statusCode: 400,
        });
      }
      if (
        !VALID_IMAGE_TYPES.find(
          (item) => item === avatar.hapi.headers["content-type"]
        )
      ) {
        return resolve({
          message: MESSAGES.AVATAR_NOT_VALID,
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
  ): Promise<IUsersResponse | IMessageResponse> => {
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
        { ...filter, type: user.type, relation_id: user.relation_id },
        sort
      );
      const result = await Promise.all(
        users.map(async (userItem) => {
          const location = await this.locationModel.find(
            userItem.location_id || ""
          );
          return {
            id: userItem.id,
            firstname: userItem.firstname,
            lastname: userItem.lastname,
            fullname: `${userItem.firstname} ${userItem.lastname}`,
            work_location: userItem.work_location,
            position: userItem.position,
            email: userItem.email,
            phone: userItem.phone,
            access_level: userItem.access_level,
            status: userItem.status,
            avatar: userItem.avatar,
            created_at: userItem.created_at,
            phone_code: location?.phone_code,
          };
        })
      );
      const pagination: IPagination = await this.userModel.getPagination(
        limit,
        offset,
        { type: user.type, relation_id: user.relation_id }
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
  public getListDepartment = (user_id: string): Promise<IDepartmentsResponse> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const rawDepartments = await this.departmentModel.getAllBy(
        { type: 0 },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      const departments = await this.departmentModel.getAllBy(
        { type: user.type, relation_id: user.relation_id },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: rawDepartments.concat(departments),
        statusCode: 200,
      });
    });
  public invite = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (user.status !== USER_STATUSES.PENDING) {
        return resolve({
          message: "Invited.",
          statusCode: 400,
        });
      }
      await this.mailService.sendRegisterEmail(user);
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
}
