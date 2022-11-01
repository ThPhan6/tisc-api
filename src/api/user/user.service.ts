import { permissionService } from "@/api/permission/permission.service";
import { COMMON_TYPES, MESSAGES, ROLES, VALID_IMAGE_TYPES } from "@/constants";
import { getAccessLevel } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { validateRoleType } from "@/helper/user.helper";
import { brandRepository } from "@/repositories/brand.repository";
import { designerRepository } from "@/repositories/designer.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { locationRepository } from "@/repositories/location.repository";
import { userRepository } from "@/repositories/user.repository";
import { deleteFile, upload } from "@/service/aws.service";
import MailService from "@/service/mail.service";
import {
  IMessageResponse,
  UserAttributes,
  UserStatus,
  UserType,
} from "@/types";
import { groupBy, uniq } from "lodash";
import moment from "moment";
import {
  IAssignTeamRequest,
  IUpdateMeRequest,
  IUserRequest,
} from "./user.type";

export default class UserService {
  private mailService: MailService;
  constructor() {
    this.mailService = new MailService();
  }

  public create = async (
    authenticatedUser: UserAttributes,
    payload: IUserRequest
  ) => {
    const user = await userRepository.findBy({ email: payload.email });
    if (user) {
      return errorMessageResponse(MESSAGES.EMAIL_USED);
    }

    if (!validateRoleType(authenticatedUser.type, payload.role_id)) {
      return errorMessageResponse(MESSAGES.CANNOT_UPDATE_TO_OTHER_ROLE);
    }

    const location = await locationRepository.find(payload.location_id);
    if (!location || location.relation_id !== authenticatedUser.relation_id) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND);
    }

    const department = await commonTypeRepository.findOrCreate(
      payload.department_id,
      authenticatedUser.relation_id,
      COMMON_TYPES.DEPARTMENT
    );

    const createdUser = await userRepository.create({
      firstname: payload.firstname,
      lastname: payload.lastname,
      gender: payload.gender,
      location_id: payload.location_id,
      work_location: location.city_name
        ? `${location.city_name}, ${location.country_name.toUpperCase()}`
        : `${location.country_name.toUpperCase()}`,
      department_id: department.id,
      position: payload.position,
      email: payload.email,
      phone: payload.phone,
      phone_code: location.phone_code ?? "",
      mobile: payload.mobile,
      role_id: payload.role_id,
      is_verified: false,
      verification_token: await userRepository.generateToken(
        "verification_token"
      ),
      type: authenticatedUser.type,
      relation_id: authenticatedUser.relation_id,
    });

    if (!createdUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    return await this.get(createdUser.id, authenticatedUser);
  };

  public get = async (
    userId: string,
    authenticatedUser: UserAttributes,
    withPermission: boolean = false
  ) => {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND);
    }

    if (
      !validateRoleType(authenticatedUser.type, user.role_id) ||
      authenticatedUser.relation_id !== user.relation_id
    ) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
    }

    const permissions = withPermission
      ? await permissionService.getList(user, true)
      : undefined;

    const result = {
      id: user.id,
      role_id: user.role_id,
      firstname: user.firstname,
      lastname: user.lastname,
      fullname: `${user.firstname} ${user.lastname}`,
      gender: user.gender,
      location_id: user.location_id,
      work_location: user.work_location,
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
      access_level: getAccessLevel(user.role_id),
      status: user.status,
      type: user.type,
      relation_id: user.relation_id,
      phone_code: user.phone_code || "",
      permissions,
      retrieve_favourite: user.retrieve_favourite,
      interested: user.interested,
    };

    if (user.type === UserType.Brand) {
      const brand = await brandRepository.find(user.relation_id);
      return successResponse({
        data: { ...result, brand },
      });
    }

    if (user.type === UserType.Designer) {
      const design = await designerRepository.find(user.relation_id);
      return successResponse({
        data: { ...result, design },
      });
    }

    return successResponse({
      data: { ...result },
    });
  };

  public update = async (
    userId: string,
    payload: IUserRequest,
    authenticatedUser: UserAttributes
  ) => {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    if (
      !validateRoleType(authenticatedUser.type, user.role_id) ||
      authenticatedUser.relation_id !== user.relation_id
    ) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
    }

    const location = await locationRepository.find(payload.location_id);
    if (!location || location.relation_id !== authenticatedUser.relation_id) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND);
    }

    const department = await commonTypeRepository.findOrCreate(
      payload.department_id,
      authenticatedUser.relation_id,
      COMMON_TYPES.DEPARTMENT
    );
    const updatedUser = await userRepository.update(user.id, {
      ...payload,
      department_id: department.id,
      phone_code: location.phone_code ?? "",
      work_location: location.city_name + ", " + location.country_name,
    });
    if (!updatedUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    return await this.get(user.id, authenticatedUser);
  };

  public updateMe = async (user: UserAttributes, payload: IUpdateMeRequest) => {
    const updatedUser = await userRepository.update(user.id, {
      backup_email: payload.backup_email || "",
      personal_mobile: payload.personal_mobile || "",
      linkedin: payload.linkedin || "",
      interested: payload.interested || [],
    });
    if (!updatedUser) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    return await this.get(user.id, user);
  };

  public delete = async (userId: string, authenticatedUser: UserAttributes) => {
    if (userId === authenticatedUser.id) {
      return errorMessageResponse(MESSAGES.DELETE_CURRENT_USER);
    }

    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    if (
      !validateRoleType(authenticatedUser.type, user.role_id) ||
      authenticatedUser.relation_id !== user.relation_id
    ) {
      return errorMessageResponse(MESSAGES.USER_NOT_IN_WORKSPACE);
    }

    await userRepository.delete(user.id);
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public updateAvatar = async (user: UserAttributes, avatar: any) => {
    if (
      !avatar._data ||
      !VALID_IMAGE_TYPES.find(
        (item) => item === avatar.hapi.headers["content-type"]
      )
    ) {
      return errorMessageResponse(MESSAGES.AVATAR_NOT_VALID);
    }

    const fileNameParts = avatar.hapi.filename.split(".");
    const fileName = fileNameParts[0] + "_" + moment();
    const newFileName = fileName + "." + fileNameParts[1];
    const filePath = `avatar/${newFileName}`;
    if (user.avatar) {
      await deleteFile(user.avatar.slice(1));
    }

    const uploadedData = await upload(
      Buffer.from(avatar._data),
      filePath,
      avatar.hapi.headers["content-type"]
    );

    if (!uploadedData) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    await userRepository.update(user.id, {
      avatar: `/${filePath}`,
    });

    return successResponse({
      data: { url: `/${filePath}` },
    });
  };

  public getList = async (
    authenticatedUser: UserAttributes,
    limit?: number,
    offset?: number,
    sort?: any,
    _filter?: any
  ) => {
    const result = await userRepository.getPagination(
      limit,
      offset,
      authenticatedUser.relation_id,
      sort
    );

    result.data = result.data.map((user: UserAttributes) => {
      return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        fullname: `${user.firstname} ${user.lastname}`,
        work_location: user.work_location,
        position: user.position,
        email: user.email,
        phone: user.phone,
        access_level: getAccessLevel(user.role_id),
        status: user.status,
        avatar: user.avatar,
        created_at: user.created_at,
        phone_code: user.phone_code,
      };
    });
    return successResponse({
      data: {
        users: result.data,
        pagination: result.pagination,
      },
    });
  };

  public invite = async (
    userId: string,
    authenticatedUser: UserAttributes
  ): Promise<IMessageResponse> => {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }
    if (user.status !== UserStatus.Pending) {
      return errorMessageResponse(MESSAGES.GENERAL.INVITED_ALREADY);
    }
    await this.mailService.sendInviteEmailTeamProfile(user, authenticatedUser);
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public getBrandOrDesignTeamGroupByCountry = async (relationId: string) => {
    const userWithLocations =
      await userRepository.getWithLocationAndDeparmentData(relationId);

    const results: {
      country_name: string;
      count: number;
      users: any[];
    }[] = Object.entries(
      groupBy(userWithLocations, "locations.country_name")
    ).map(([country_name, users]) => ({
      country_name:
        country_name === "undefined" ? "Empty Location" : country_name,
      users: users.map((user) => ({
        id: user.id,
        phone_code: user.phone_code,
        avatar: user.avatar,
        firstname: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        work_location: user.work_location,
        department: user.common_types?.name || null,
        position: user.position,
        email: user.email,
        phone: user.phone,
        mobile: user.mobile,
        access_level: getAccessLevel(user.role_id),
        status: user.status,
      })),
      count: (users as any[]).length,
    }));

    return successResponse({ data: results });
  };

  public assignTeamToBrand = async (
    brandId: string,
    payload: IAssignTeamRequest
  ) => {
    const brand = await brandRepository.find(brandId);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }
    const userIds = uniq(payload.user_ids);
    const updatedBrand = await brandRepository.update(brand.id, {
      team_profile_ids: userIds,
    });
    if (!updatedBrand) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public getTiscTeamsProfile = async (brandId: string) => {
    const brand = await brandRepository.find(brandId);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    const users = await userRepository.getTiscUsers();
    const response = users.map((user) => {
      const isAssigned = brand.team_profile_ids.includes(user.id);
      return {
        id: user.id,
        role_id: user.role_id,
        avatar: user.avatar,
        firstname: user.firstname,
        lastname: user.lastname,
        is_assigned: isAssigned,
      };
    });

    const groupTiscTeams = response.filter(
      (user) => user.role_id === ROLES.TISC_ADMIN
    );

    const groupConsultantTeams = response.filter(
      (user) => user.role_id === ROLES.TISC_CONSULTANT_TEAM
    );

    const result = [
      {
        name: "TISC TEAMS",
        users: groupTiscTeams,
      },
      {
        name: "CONSULTANT TEAMS",
        users: groupConsultantTeams,
      },
    ];
    return successResponse({ data: result });
  };
}

export const userService = new UserService();
