import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { actionTaskService } from "./action_task.service";
import {
  ActionTaskRequestCreate,
  ActionTaskRequestUpdateStatus,
} from "./action_task.type";

export default class ActionTaskController {
  public async create(
    req: Request & { payload: ActionTaskRequestCreate },
    toolkit: ResponseToolkit
  ) {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await actionTaskService.create(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public async update(
    req: Request & { payload: ActionTaskRequestUpdateStatus },
    toolkit: ResponseToolkit
  ) {
    const { id } = req.params;
    const payload = req.payload;
    const response = await actionTaskService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
