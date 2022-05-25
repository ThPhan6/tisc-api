import * as Hapi from "@hapi/hapi";
import UserController from "./user.controller";
import validate from "./user.validate";
import IRoute from "../../helper/route.helper";
const PREFIX = "/api/team-profile";
import {
  defaultRouteOptionResponseStatus,
  generalMessageResponse,
} from "../../helper/response.helper";

export default class UserRoutes implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserController();

      server.route([
        {
          method: "POST",
          path: `${PREFIX}/create`,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create an user",
            tags: ["api", "Team profile"],
            auth: false,
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
