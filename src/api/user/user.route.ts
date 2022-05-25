import * as Hapi from "@hapi/hapi";
import UserController from "./user.controller";
import validate from "./user.validate";
import IRoute from "../../helper/route.helper";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";

export default class UserRoutes implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_TEAM_PROFILE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create an user",
            tags: ["api", "Team profile"],
            auth: AUTH_NAMES.ADMIN,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: generalMessageResponse,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
