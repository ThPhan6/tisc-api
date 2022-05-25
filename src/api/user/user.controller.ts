import UserService from "./user.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IUserRequest } from "./user.type";

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
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
