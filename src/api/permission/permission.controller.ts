import PermissionService from "./permission.service";
import { Request, ResponseToolkit } from "@hapi/hapi";

export default class PermissionController {
  private service: PermissionService;
  constructor() {
    this.service = new PermissionService();
  }
  public getMenu = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getMenu(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getList(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
