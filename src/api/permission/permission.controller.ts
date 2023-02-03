import { permissionService } from "./permission.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { UserAttributes } from "@/types";

export default class PermissionController {
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await permissionService.getList(user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public openClose = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await permissionService.openClose(id, user, req.path);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
