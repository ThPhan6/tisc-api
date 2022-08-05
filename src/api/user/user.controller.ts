import UserService from "./user.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  IAssignTeamRequest,
  IUpdateMeRequest,
  IUserRequest,
} from "./user.type";
import {
  INTERESTED_IN_OPTIONS,
  SYSTEM_TYPE,
} from "../../constant/common.constant";

export default class UserController {
  private service: UserService;
  constructor() {
    this.service = new UserService();
  }
  public create = async (
    req: Request & { payload: IUserRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getMe = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.get(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const currentUserId = req.auth.credentials.user_id as string;
    const userId = req.params.id;
    const response = await this.service.get(userId, currentUserId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public invite = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.invite(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort } = req.query;
    const userId = req.auth.credentials.user_id as string;

    const response = await this.service.getList(
      userId,
      limit,
      offset,
      filter,
      sort
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateMe = async (
    req: Request & { payload: IUpdateMeRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.updateMe(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUserRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const currentUserId = req.auth.credentials.user_id as string;
    const userId = req.params.id;
    const response = await this.service.update(userId, payload, currentUserId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateAvatar = async (
    req: Request & { payload: { avatar: any } },
    toolkit: ResponseToolkit
  ) => {
    const avatar = req.payload.avatar;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.updateAvatar(userId, avatar);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getDepartments = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getListDepartment(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const currentUserId = req.auth.credentials.user_id as string;
    const userId = req.params.id;
    const response = await this.service.delete(userId, currentUserId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getInterestedOptions = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    return toolkit.response(INTERESTED_IN_OPTIONS).code(200);
  };

  public getBrandTeamGroupByCountry = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.params;
    const response = await this.service.getBrandOrDesignTeamGroupByCountry(
      brand_id,
      SYSTEM_TYPE.BRAND
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getDesignTeamGroupByCountry = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { design_id } = req.params;
    const response = await this.service.getBrandOrDesignTeamGroupByCountry(
      design_id,
      SYSTEM_TYPE.DESIGN
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public assignTeam = async (
    req: Request & { payload: IAssignTeamRequest },
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.params;
    const payload = req.payload;
    const response = await this.service.assignTeam(brand_id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getTeamGroupByType = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.params;
    const response = await this.service.getTeamGroupByType(brand_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
