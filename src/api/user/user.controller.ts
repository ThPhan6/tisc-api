import { userService } from "./user.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { UserAttributes } from "@/types";
import {
  IAssignTeamRequest,
  IUpdateMeRequest,
  IUserRequest,
} from "./user.type";
import { INTERESTED_IN_OPTIONS } from "@/constants";

export default class UserController {
  public create = async (
    req: Request & { payload: IUserRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await userService.create(user, payload);
    return toolkit.response(response).code(response.statusCode);
  };
  public getMe = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await userService.get(user.id, user, true);
    return toolkit.response(response).code(response.statusCode);
  };

  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.params.id;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await userService.get(userId, user);
    return toolkit.response(response).code(response.statusCode);
  };

  public invite = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await userService.invite(id, user);
    return toolkit.response(response).code(response.statusCode);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, order } = req.query;
    const user = req.auth.credentials.user as UserAttributes;

    const response = await userService.getList(
      user,
      limit,
      offset,
      sort,
      order,
      filter
    );
    return toolkit.response(response).code(response.statusCode);
  };

  public updateMe = async (
    req: Request & { payload: IUpdateMeRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await userService.updateMe(user, payload);
    return toolkit.response(response).code(response.statusCode);
  };
  public update = async (
    req: Request & { payload: IUserRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const userId = req.params.id;
    const response = await userService.update(userId, payload, user);
    return toolkit.response(response).code(response.statusCode);
  };
  public updateAvatar = async (
    req: Request & { payload: { avatar: any } },
    toolkit: ResponseToolkit
  ) => {
    const avatar = req.payload.avatar;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await userService.updateAvatar(user, avatar);
    return toolkit.response(response).code(response.statusCode);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const userId = req.params.id;
    const response = await userService.delete(userId, user);
    return toolkit.response(response).code(response.statusCode);
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
    const response = await userService.getBrandOrDesignTeamGroupByCountry(
      brand_id
    );
    return toolkit.response(response).code(response.statusCode);
  };
  public getDesignTeamGroupByCountry = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { design_id } = req.params;
    const response = await userService.getBrandOrDesignTeamGroupByCountry(
      design_id
    );
    return toolkit.response(response).code(response.statusCode);
  };

  public assignTeam = async (
    req: Request & { payload: IAssignTeamRequest },
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.params;
    const payload = req.payload;
    const response = await userService.assignTeamToBrand(brand_id, payload);
    return toolkit.response(response).code(response.statusCode);
  };

  public getTiscTeamsProfile = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.params;
    const response = await userService.getTiscTeamsProfile(brand_id);
    return toolkit.response(response).code(response.statusCode);
  };
}
