import { generalMessageResponse } from "./../../helper/response.helper";
import * as Hapi from "@hapi/hapi";
import commonValidate from "../../validate/common.validate";
import IRoute from "../../helper/route.helper";
import { defaultRouteOptionResponseStatus } from "../../helper/response.helper";
import { ROUTES } from "../../constant/api.constant";
import { AUTH_NAMES } from "../../constant/auth.constant";
import validate from "./project_zone.validate";
import response from "./project_zone.response";
import ProjectZoneController from "./project_zone.controller";
export default class ProjectZoneRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProjectZoneController();

      server.route([
        {
          method: "POST",
          path: ROUTES.CREATE_PROJECT_ZONE,
          options: {
            handler: controller.create,
            validate: validate.create,
            description: "Method that create project zone",
            tags: ["api", "Project Zone"],
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
          method: "GET",
          path: ROUTES.GET_LIST_PROJECT_ZONE,
          options: {
            handler: controller.getList,
            validate: validate.getList,
            description: "Method that get list project zone",
            tags: ["api", "Project Zone"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getList,
              },
            },
          },
        },
      ]);

      resolve(true);
    });
  }
}
