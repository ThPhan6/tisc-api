import {permissionService} from "./permission.service";
import { Request, ResponseToolkit } from "@hapi/hapi";

export default class PermissionController {

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await permissionService.getList(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public openClose = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await permissionService.openClose(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

}
