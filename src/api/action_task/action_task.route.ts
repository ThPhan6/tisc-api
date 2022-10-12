import { AUTH_NAMES, ROUTES } from "@/constants";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import IRoute from "@/helper/route.helper";
import { Server } from "@hapi/hapi";
import validate from "./action_task.validate";
import response from "./action_task.response";
import ActionTaskController from "./action_task.controller";
export default class ActionTaskRoute implements IRoute {
  public async register(server: Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ActionTaskController();

      server.route([
        {
          method: "POST",
          path: ROUTES.ACTION_TASK.CREATE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create action task",
            tags: ["api", "Action Task"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getOne,
              },
            },
          },
        },
        {
          method: "PATCH",
          path: ROUTES.ACTION_TASK.UPDATE,
          options: {
            handler: controller.update,
            validate: validate.update,
            description: "Method that update status action task",
            tags: ["api", "Action Task"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
